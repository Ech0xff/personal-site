import { makeServerClient } from "./supabase";

export async function authGuard() {
  const supabase = await makeServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return { user, supabase };
}
