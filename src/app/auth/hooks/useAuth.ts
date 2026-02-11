import { SupabaseClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { toast } from 'sonner';

import { makeBrowserClient } from "@/lib/supabase/make-browser-client";

export function useAuth(supabase?: SupabaseClient) {
  if (!supabase) supabase = makeBrowserClient();

  const handleLogin = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Invalid email or password");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      toast.error("Invalid email or password");
      return;
    }

    redirect("/");
  };

  const handleRegister = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      toast.error("Invalid email or password");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      toast.error("Error registering user");
      return;
    }

    redirect("/");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Error logging out");
      return;
    }
    redirect("/auth");
  };

  const handleLoginWithOauth = async () => {
    const origin = window.location.origin;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error || !data.url) {
      toast.error("Error logging in with OAuth");
      return;
    }

    redirect(data.url);
  };

  return { handleLogin, handleRegister, handleLogout, handleLoginWithOauth };
}
