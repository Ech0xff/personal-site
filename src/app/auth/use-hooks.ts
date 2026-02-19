import { useState } from "react";

import { redirect } from "next/navigation";

import { toast } from "sonner";

import { makeBrowserClient } from "@/lib/client/supabase";

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

  const updateForm = (updates: Partial<AuthForm>) => {
    setForm((current) => ({ ...current, ...updates }));
  };

  const setMode = (nextMode: Mode) => {
    setModeState(nextMode);
    setForm(initialForm);
  };

  const handleLogin = async ({ email, password }: AuthForm) => {
    const toastId = toast.loading("Logging in...");

    if (!email || !password) {
      toast.error("Invalid email or password", { id: toastId });
      return;
    }

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      toast.error("Invalid email or password", { id: toastId });
      return;
    }

    toast.success("Logged in successfully.", { id: toastId });
    redirect("/dashboard/account");
  };

  const handleRegister = async ({
    email,
    password,
    confirmPassword,
  }: AuthForm) => {
    const toastId = toast.loading("Creating account...");

    if (!email || !password) {
      toast.error("Invalid email or password", { id: toastId });
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", { id: toastId });
      return;
    }

    const { error } = await client.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error("Error registering user", { id: toastId });
      return;
    }

    toast.success("Account created successfully.", { id: toastId });
    redirect("/dashboard/account");
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    const { error } = await client.auth.signOut();
    if (error) {
      toast.error("Error logging out", { id: toastId });
      return;
    }
    toast.success("Logged out successfully.", { id: toastId });
    redirect("/auth");
  };

  const handleLoginWithOauth = async () => {
    const origin = window.location.origin;
    const toastId = toast.loading("Starting OAuth login...");

    const { data, error } = await client.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard/account`,
      },
    });

    if (error || !data.url) {
      toast.error("Error logging in with OAuth", { id: toastId });
      return;
    }

    toast.success("Redirecting to OAuth provider...", { id: toastId });
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
    form,
    updateForm,
    handleLogin,
    handleRegister,
    handleSubmit,
    handleLogout,
    handleLoginWithOauth,
  };
};
