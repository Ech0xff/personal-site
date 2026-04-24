"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

import { makeBrowserClient } from "@/lib/client/supabase";
import { type OAuthProvider, providerConfig } from "@/lib/shared/config";
import { getT } from "@/lib/shared/i18n";
import { getLocalizedRoutes } from "@/lib/shared/routes";

interface Props {
  oauthProviders: OAuthProvider[];
  locale: string;
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

export default function PageClient({ oauthProviders, locale }: Props) {
  const client = makeBrowserClient();
  const router = useRouter();
  const routes = getLocalizedRoutes(locale);
  const t = getT("auth", locale);
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
    const toastId = toast.loading(t("loggingIn"));

    if (!email || !password) {
      toast.error(t("invalidEmailOrPassword"), { id: toastId });
      return;
    }

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      toast.error(t("invalidEmailOrPassword"), { id: toastId });
      return;
    }

    toast.success(t("loggedInSuccessfully"), { id: toastId });
    router.replace(routes.DASHBOARD.ACCOUNT);
  };

  const handleRegister = async ({
    email,
    password,
    confirmPassword,
  }: AuthForm) => {
    const toastId = toast.loading(t("creatingAccount"));
    if (!email || !password) {
      toast.error(t("invalidEmailOrPassword"), { id: toastId });
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("passwordsDoNotMatch"), { id: toastId });
      return;
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error(t("errorRegisteringUser"), { id: toastId });
      return;
    }

    if (data.user?.email) {
      toast.error(t("emailReservedForOauth"), { id: toastId });
      return;
    }

    toast.success(t("accountCreatedSuccessfully"), { id: toastId });
    router.replace(routes.DASHBOARD.ACCOUNT);
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
    const toastId = toast.loading(t("startingOAuthLogin"));

    const { data, error } = await client.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${origin}/api/auth/callback`,
      },
    });

    if (error || !data.url) {
      toast.error(t("errorLoggingInWithOAuth"), { id: toastId });
      return;
    }

    toast.success(t("redirectingToOAuthProvider"), { id: toastId });
    window.location.assign(data.url);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSubmit();
  };

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="mb-2 font-bold text-3xl text-zinc-900 dark:text-zinc-100">
          {mode === "login" ? t("welcomeBack") : t("createAccount")}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          {mode === "login"
            ? t("signInToYourAccount")
            : t("signUpForNewAccount")}
        </p>
      </div>

      <div className="mb-6 flex rounded-lg bg-zinc-200 p-1 dark:bg-zinc-800">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 rounded-md px-4 py-2 font-medium text-sm transition-all duration-200 ${
            mode === "login"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          {t("signIn")}
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`flex-1 rounded-md px-4 py-2 font-medium text-sm transition-all duration-200 ${
            mode === "register"
              ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
              : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          }`}
        >
          {t("signUp")}
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block font-medium text-sm text-zinc-700 dark:text-zinc-300"
          >
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder={t("enterYourEmail")}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            required
            autoFocus
            value={form.email}
            onChange={(event) => updateForm({ email: event.target.value })}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block font-medium text-sm text-zinc-700 dark:text-zinc-300"
          >
            {t("password")}
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder={t("enterYourPassword")}
            className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
            required
            value={form.password}
            onChange={(event) => updateForm({ password: event.target.value })}
          />
        </div>

        {mode === "register" && (
          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block font-medium text-sm text-zinc-700 dark:text-zinc-300"
            >
              {t("confirmPassword")}
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={t("repeatYourPassword")}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
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
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mode === "login" ? t("signIn") : t("signUp")}
        </button>
      </form>

      {oauthProviders.length > 0 && (
        <>
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
            <span className="text-sm text-zinc-400 dark:text-zinc-500">
              {t("or")}
            </span>
            <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
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
                  className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white px-4 py-3 font-medium text-zinc-900 transition-all duration-200 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                >
                  <Icon className="h-5 w-5" />
                  {t("continueWith", { provider: config.label })}
                </button>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
