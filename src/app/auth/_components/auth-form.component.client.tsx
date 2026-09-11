"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { useDictionary } from "#dictionary";
import { makeBrowserClient } from "#lib/client/supabase.client";
import { type OAuthProvider, providerConfig } from "#lib/shared/config";
import { formatMessage } from "#lib/shared/dictionary/dictionary.helper";
import { ROUTES } from "#lib/shared/routes/routes.const";

interface Props {
  oauthProviders: OAuthProvider[];
}

type Mode = "login" | "register";

type AuthForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

const initialForm: AuthForm = {
  email: "",
  password: "",
  confirmPassword: "",
};

export default function AuthForm({ oauthProviders }: Props) {
  const client = makeBrowserClient();
  const router = useRouter();
  const dictionary = useDictionary();
  const [mode, setModeState] = useState<Mode>("login");
  const [form, setForm] = useState<AuthForm>(initialForm);

  const updateForm = (updates: Partial<AuthForm>) => {
    setForm((current) => ({ ...current, ...updates }));
  };

  const setMode = (nextMode: Mode) => {
    setModeState(nextMode);
    setForm(initialForm);
  };

  const handleLogin = async ({ email, password }: AuthForm) => {
    const toastId = toast.loading(dictionary.auth.loggingIn);

    if (!email || !password) {
      toast.error(dictionary.auth.invalidEmailOrPassword, { id: toastId });
      return;
    }

    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error(dictionary.auth.invalidEmailOrPassword, { id: toastId });
      return;
    }

    toast.success(dictionary.auth.loggedInSuccessfully, { id: toastId });
    router.replace(ROUTES.DASHBOARD.ACCOUNT);
  };

  const handleRegister = async ({
    email,
    password,
    confirmPassword,
  }: AuthForm) => {
    const toastId = toast.loading(dictionary.auth.creatingAccount);
    if (!email || !password) {
      toast.error(dictionary.auth.invalidEmailOrPassword, { id: toastId });
      return;
    }

    if (password !== confirmPassword) {
      toast.error(dictionary.auth.passwordsDoNotMatch, { id: toastId });
      return;
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(dictionary.auth.errorRegisteringUser, { id: toastId });
      return;
    }

    if (data.user?.email) {
      toast.error(dictionary.auth.emailReservedForOauth, { id: toastId });
      return;
    }

    toast.success(dictionary.auth.accountCreatedSuccessfully, { id: toastId });
    router.replace(ROUTES.DASHBOARD.ACCOUNT);
  };

  const handleSubmit = async () => {
    if (mode === "login") {
      await handleLogin(form);
      return;
    }

    await handleRegister(form);
  };

  const handleLoginWithOauth = async (provider: OAuthProvider) => {
    const origin = window.location.origin;
    const toastId = toast.loading(dictionary.auth.startingOAuthLogin);

    const { data, error } = await client.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/api/auth/callback`,
      },
    });

    if (error || !data.url) {
      toast.error(dictionary.auth.errorLoggingInWithOAuth, { id: toastId });
      return;
    }

    toast.success(dictionary.auth.redirectingToOAuthProvider, { id: toastId });
    window.location.assign(data.url);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSubmit();
  };

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-(--text-primary)">
          {mode === "login"
            ? dictionary.auth.welcomeBack
            : dictionary.auth.createAccount}
        </h1>
        <p className="text-(--text-muted)">
          {mode === "login"
            ? dictionary.auth.signInToYourAccount
            : dictionary.auth.signUpForNewAccount}
        </p>
      </div>

      <div className="mb-6 flex rounded-lg bg-(--surface-muted) p-1">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
            mode === "login"
              ? "bg-(--surface-selected) text-(--text-primary) shadow-sm"
              : "text-(--text-muted) hover:text-(--text-secondary)"
          }`}
        >
          {dictionary.auth.signIn}
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
            mode === "register"
              ? "bg-(--surface-selected) text-(--text-primary) shadow-sm"
              : "text-(--text-muted) hover:text-(--text-secondary)"
          }`}
        >
          {dictionary.auth.signUp}
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-(--text-secondary)"
          >
            {dictionary.auth.email}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder={dictionary.auth.enterYourEmail}
            className="w-full rounded-lg border border-(--border-strong) bg-(--surface-input) px-4 py-3 text-(--text-primary) transition-all duration-200 placeholder:text-(--text-placeholder) focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            autoFocus
            value={form.email}
            onChange={(event) => updateForm({ email: event.target.value })}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-(--text-secondary)"
          >
            {dictionary.auth.password}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder={dictionary.auth.enterYourPassword}
            className="w-full rounded-lg border border-(--border-strong) bg-(--surface-input) px-4 py-3 text-(--text-primary) transition-all duration-200 placeholder:text-(--text-placeholder) focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            value={form.password}
            onChange={(event) => updateForm({ password: event.target.value })}
          />
        </div>

        {mode === "register" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-(--text-secondary)"
            >
              {dictionary.auth.confirmPassword}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={dictionary.auth.repeatYourPassword}
              className="w-full rounded-lg border border-(--border-strong) bg-(--surface-input) px-4 py-3 text-(--text-primary) transition-all duration-200 placeholder:text-(--text-placeholder) focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
              value={form.confirmPassword}
              onChange={(event) =>
                updateForm({ confirmPassword: event.target.value })
              }
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mode === "login" ? dictionary.auth.signIn : dictionary.auth.signUp}
        </button>
      </form>

      {oauthProviders.length > 0 && (
        <>
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-(--border-default)" />
            <span className="text-sm text-(--text-placeholder)">
              {dictionary.auth.or}
            </span>
            <div className="h-px flex-1 bg-(--border-default)" />
          </div>

          <div className="flex flex-col gap-3">
            {oauthProviders.map((provider) => {
              const config = providerConfig[provider];
              const Icon = config.icon;
              return (
                <button
                  key={provider}
                  type="button"
                  onClick={() => void handleLoginWithOauth(provider)}
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-(--border-strong) bg-(--surface-input) px-4 py-3 font-medium text-(--text-primary) transition-all duration-200 hover:bg-(--surface-hover)"
                >
                  <Icon className="h-5 w-5" />
                  {formatMessage(dictionary.auth.continueWith, {
                    provider: config.label,
                  })}
                </button>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
