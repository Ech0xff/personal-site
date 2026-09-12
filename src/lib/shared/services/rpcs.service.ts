import type { SupabaseClient } from "@supabase/supabase-js";
import { assert } from "es-toolkit";
import { z } from "zod";

import type { BlogSummaryData, Database, TagSourceType } from "#types";

import { makeStaticClient } from "../supabase.client";

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

const summaryItemSchema = z.object({
  count: z.number(),
  characters: z.number(),
  contributions: z.array(
    z.object({
      date: z.string(),
      count: z.number(),
    }),
  ),
});
const jsonValueSchema = z.json();

const blogSummarySchema: z.ZodType<BlogSummaryData> = z.object({
  posts: summaryItemSchema,
  thoughts: summaryItemSchema,
  events: summaryItemSchema,
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      meta: jsonValueSchema,
      count: z.number(),
    }),
  ),
});

const searchRpcRowSchema: z.ZodType<SearchRpcRow> = z.object({
  id: z.string(),
  type: z.enum(["post", "thought", "event"]),
  title: z.string().nullable(),
  snippet: z.string(),
  published_at: z.string(),
});

export const parseSummaryData = (value: unknown) =>
  blogSummarySchema.nullable().parse(value);

export const parseSearchRpcRows = (value: unknown) =>
  searchRpcRowSchema.array().parse(value ?? []);

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
  const summary = parseSummaryData(data);
  assert(summary, "Summary data is unavailable");
  return summary;
};

export const fetchSearchContent = async (
  searchQuery: string,
  client: SupabaseClient<Database> = makeStaticClient(),
) => {
  const { data, error } = await client.rpc("search_content", {
    search_query: searchQuery,
  });
  if (error) throw error;
  return parseSearchRpcRows(data);
};
