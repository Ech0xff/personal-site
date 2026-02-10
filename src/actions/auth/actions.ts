"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { makeServerClient } from "@/lib/supabase";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await makeServerClient();
  
  if (!email || !password) {
    redirect("/auth?error=invalid");
  }

  await supabase.auth.signInAnonymously();
  await supabase.auth.signUp({
    email,
    password,
  });

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    redirect("/auth?error=invalid");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profile?.role === "admin") {
    redirect("/dashboard");
  }

  redirect("/");
}

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await makeServerClient();

  if (!email || !password) {
    redirect("/auth?error=invalid");
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect("/auth?error=register");
  }

  redirect("/");
}

export async function loginWithGithub() {
  const supabase = await makeServerClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/auth?error=oauth");
  }

  redirect(data.url);
}

export async function logout() {
  const supabase = await makeServerClient();
  await supabase.auth.signOut();

  redirect("/auth");
}
