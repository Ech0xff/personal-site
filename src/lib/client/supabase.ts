import { createBrowserClient } from "@supabase/ssr";

import { Database } from "@/types/supabase";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function makeBrowserClient() {
  if (client) return client;
  return (client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ));
}
