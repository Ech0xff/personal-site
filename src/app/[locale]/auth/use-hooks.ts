"use client";

import { redirect, usePathname } from "next/navigation";
import { useState } from "react";

import { toast } from "sonner";

import { makeBrowserClient } from "@/lib/client/supabase";
import { getT } from "@/lib/shared/i18n";

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

export const useHooks = () => {
  const client = makeBrowserClient();

  const [mode, setModeState] = useState<Mode>("login");
  const [form, setForm] = useState<AuthForm>(initialForm);

  const pathname = usePathname();
  const t = getT("auth", pathname.split("/")[1]);
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
    redirect("/dashboard/account");
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
    redirect("/dashboard/account");
  };

  const handleLogout = async () => {
    const toastId = toast.loading(t("loggingOut"));
    const { error } = await client.auth.signOut();
    if (error) {
      toast.error(t("errorLoggingOut"), { id: toastId });
      return;
    }
    toast.success(t("loggedOutSuccessfully"), { id: toastId });
    redirect("/auth");
  };

  const handleLoginWithOauth = async (provider: string) => {
    const origin = window.location.origin;
    const toastId = toast.loading(t("startingOAuthLogin"));

    const { data, error } = await client.auth.signInWithOAuth({
      provider: provider as "github" | "google",
      options: {
        redirectTo: `${origin}/api/auth/callback`,
      },
    });

    if (error || !data.url) {
      toast.error(t("errorLoggingInWithOAuth"), { id: toastId });
      return;
    }

    toast.success(t("redirectingToOAuthProvider"), { id: toastId });
    redirect(data.url);
  };

  const handleSubmit = async () => {
    if (mode === "login") {
      await handleLogin(form);
      return;
    }

    await handleRegister(form);
  };

  return {
    mode,
    setMode,
    t,
    form,
    updateForm,
    handleLogin,
    handleRegister,
    handleSubmit,
    handleLogout,
    handleLoginWithOauth,
  };
};
