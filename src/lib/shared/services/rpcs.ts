import type { SupabaseClient } from "@supabase/supabase-js";

import type { BlogSummaryData, Database, Status, TagSourceType } from "@/types";

import { makeStaticClient } from "../supabase";

type FetchSummaryOptions = {
  queryStatus?: Status | null;
  tagSourceTypes?: TagSourceType[] | null;
};

export const fetchSummary = async (
  client: SupabaseClient<Database> = makeStaticClient(),
  options: FetchSummaryOptions = {},
) => {
  const args = {
    ...(options.queryStatus !== undefined
      ? { query_status: options.queryStatus ?? undefined }
      : {}),
    ...(options.tagSourceTypes !== undefined
      ? { tag_source_types: options.tagSourceTypes ?? undefined }
      : {}),
  };
  const { data, error } = await client.rpc("get_summary", args);
  if (error) throw error;
  return data as BlogSummaryData | null;
};
