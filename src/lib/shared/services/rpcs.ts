import type { SupabaseClient } from "@supabase/supabase-js";

import type { BlogSummaryData, Database, TagSourceType } from "@/types";

import { makeStaticClient } from "../supabase";

type FetchSummaryOptions = {
  tagSourceTypes?: TagSourceType[] | null;
};

export type SearchRpcRow = {
  id: string;
  type: "post" | "thought" | "event";
  title: string | null;
  snippet: string;
  published_at: string;
};

export const fetchSummary = async (
  client: SupabaseClient<Database> = makeStaticClient(),
  options: FetchSummaryOptions = {},
) => {
  const args = {
    ...(options.tagSourceTypes !== undefined
      ? { tag_source_types: options.tagSourceTypes ?? undefined }
      : {}),
  };
  const { data, error } = await client.rpc("get_summary", args);
  if (error) throw error;
  return data as BlogSummaryData | null;
};

export const fetchSearchContent = async (
  searchQuery: string,
  client: SupabaseClient<Database> = makeStaticClient(),
) => {
  const { data, error } = await client.rpc("search_content", {
    search_query: searchQuery,
  });
  if (error) throw error;
  return (data || []) as SearchRpcRow[];
};
