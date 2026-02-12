import { redirect } from "next/navigation";

import { SupabaseClient } from "@supabase/supabase-js";
import { toast } from "sonner";

import { makeBrowserClient } from "@/lib/client/supabase";

export function useAuth(supabase?: SupabaseClient) {
  if (!supabase) supabase = makeBrowserClient();

  const handleLogin = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const toastId = toast.loading("Logging in...");

    if (!email || !password) {
      toast.error("Invalid email or password", { id: toastId });
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      toast.error("Invalid email or password", { id: toastId });
      return;
    }

    toast.success("Logged in successfully.", { id: toastId });
    redirect("/");
  };

  const handleRegister = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const toastId = toast.loading("Creating account...");

    if (!email || !password) {
      toast.error("Invalid email or password", { id: toastId });
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error("Error registering user", { id: toastId });
      return;
    }

    toast.success("Account created successfully.", { id: toastId });
    redirect("/");
  };

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...");
    const { error } = await supabase.auth.signOut();
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

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error || !data.url) {
      toast.error("Error logging in with OAuth", { id: toastId });
      return;
    }

    toast.success("Redirecting to OAuth provider...", { id: toastId });
    redirect(data.url);
  };

  return { handleLogin, handleRegister, handleLogout, handleLoginWithOauth };
}
