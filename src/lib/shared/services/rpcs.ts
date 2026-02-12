import { SupabaseClient } from "@supabase/supabase-js";

import { BlogSummaryData, Database } from "@/types";

export const fetchSummary = async (
  client: SupabaseClient<Database>,
  recent_limit: number = 5,
) => {
  const { data, error } = await client.rpc("get_summary", {
    recent_limit: recent_limit,
  });
  if (error) throw error;
  return data as BlogSummaryData | null;
};
