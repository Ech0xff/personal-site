import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, TablesInsert, TablesUpdate } from "@/types";

import { makeStaticClient } from "../supabase";

type TagInsert = TablesInsert<"tags">;
type TagUpdate = TablesUpdate<"tags">;

export const createTag = async (
  input: TagInsert,
  client: SupabaseClient<Database> = makeStaticClient(),
) => {
  const { data, error } = await client
    .from("tags")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data;
};

export const updateTag = async (
  { id, ...input }: TagUpdate,
  client: SupabaseClient<Database> = makeStaticClient(),
) => {
  const { data, error } = await client
    .from("tags")
    .update(input)
    .eq("id", id!)
    .select("*")
    .single();
  if (error) throw error;
  return data;
};
