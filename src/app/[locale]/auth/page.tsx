"use client";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import Link from "@/components/ui/Link";
import { useCurrentLocale } from "@/lib/client/locale";
import { fetchAvailableOauthProvidersByBrowser } from "@/lib/client/services";
import { type OAuthProvider, providerConfig } from "@/lib/shared/config/oauth";

import { useHooks } from "./use-hooks";

export default function PageClient() {
  const locale = useCurrentLocale();
  const [availableOauthProviders, setAvailableOauthProviders] = useState<
    OAuthProvider[]
  >([]);
  const {
    mode,
    setMode,
    form,
    updateForm,
    handleSubmit,
    handleLoginWithOauth,
    t,
  } = useHooks();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await handleSubmit();
  };

  useEffect(() => {
    let cancelled = false;

    void fetchAvailableOauthProvidersByBrowser(locale).then((providers) => {
      if (!cancelled) {
        setAvailableOauthProviders(providers);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-(--theme-bg) p-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
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

          {/* Mode Toggle */}
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
                onChange={(event) =>
                  updateForm({ password: event.target.value })
                }
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

          {/* Divider */}
          {availableOauthProviders.length > 0 && (
            <>
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
                <span className="text-sm text-zinc-400 dark:text-zinc-500">
                  {t("or")}
                </span>
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-700" />
              </div>

              <div className="flex flex-col gap-3">
                {availableOauthProviders.map((provider) => {
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
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <Link href="/" className="transition-colors hover:text-blue-500">
            &larr; {t("backToHome")}
          </Link>
        </p>
      </div>
    </div>
  );
}
