import { createClient } from "@supabase/supabase-js";

import { Database } from "@/types/supabase";

let client: ReturnType<typeof createClient<Database>> | undefined;

export function makeStaticClient() {
  if (client) return client;
  return (client = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ));
}
