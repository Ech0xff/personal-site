import { SupabaseClient } from "@supabase/supabase-js";

import { BlogSummaryData, Database } from "@/types";

import { makeStaticClient } from "../supabase";

export const fetchSummary = async (
  recent_limit: number = 5,
  client: SupabaseClient<Database> = makeStaticClient(),
) => {
  const { data, error } = await client.rpc("get_summary", {
    recent_limit: recent_limit,
  });
  if (error) throw error;
  return data as BlogSummaryData | null;
};
