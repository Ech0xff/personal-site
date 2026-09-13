import { createClient } from "@supabase/supabase-js";

import type { Database } from "#types/supabase";
let client: ReturnType<typeof createClient<Database>> | undefined;
export function makeDeskClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Supabase is not configured.");
  client ??= createClient<Database>(url, key, {
    auth: {
      storageKey: "desk-public-rpc",
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  return client;
}
