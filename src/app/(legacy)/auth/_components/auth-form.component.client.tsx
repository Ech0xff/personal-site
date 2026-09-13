"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { toast } from "sonner";

import Button from "#components/ui/button.component";
import Input from "#components/ui/input.component";
import SegmentedToggle from "#components/ui/segmented-toggle.component";
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
  const [submitting, setSubmitting] = useState(false);
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
    if (submitting) return;
    setSubmitting(true);
    try {
      await handleSubmit();
    } finally {
      setSubmitting(false);
    }
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
      <SegmentedToggle
        value={mode}
        onChange={setMode}
        options={[
          { value: "login", label: dictionary.auth.signIn },
          { value: "register", label: dictionary.auth.signUp },
        ]}
        className="mb-6 w-full"
        buttonClassName="flex-1"
      />
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-(--text-secondary)"
          >
            {dictionary.auth.email}
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={dictionary.auth.enterYourEmail}
            className="w-full"
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
          <Input
            id="password"
            name="password"
            type="password"
            placeholder={dictionary.auth.enterYourPassword}
            className="w-full"
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
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={dictionary.auth.repeatYourPassword}
              className="w-full"
              required
              value={form.confirmPassword}
              onChange={(event) =>
                updateForm({ confirmPassword: event.target.value })
              }
            />
          </div>
        )}
        <Button type="submit" className="w-full" loading={submitting}>
          {mode === "login" ? dictionary.auth.signIn : dictionary.auth.signUp}
        </Button>
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
                <Button
                  key={provider}
                  variant="secondary"
                  onClick={() => void handleLoginWithOauth(provider)}
                  className="w-full gap-3"
                >
                  <Icon className="h-5 w-5" />
                  {formatMessage(dictionary.auth.continueWith, {
                    provider: config.label,
                  })}
                </Button>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
