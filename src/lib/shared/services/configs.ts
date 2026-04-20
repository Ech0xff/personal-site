import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database, Json } from "@/types";

import { makeStaticClient } from "../supabase";

export const fetchConfig = async (
  client: SupabaseClient<Database> = makeStaticClient(),
  key: string,
) => {
  const { data, error } = await client
    .from("configs")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  if (error) throw error;
  return data?.value ?? null;
};

export const setConfig = async (
  client: SupabaseClient<Database> = makeStaticClient(),
  key: string,
  value: Json,
) => {
  const { data, error } = await client
    .from("configs")
    .upsert({ key, value }, { onConflict: "key" })
    .select("value")
    .single();
  if (error) throw error;
  return data.value;
};

export const deleteConfig = async (
  client: SupabaseClient<Database> = makeStaticClient(),
  key: string,
) => {
  const { error } = await client.from("configs").delete().eq("key", key);
  if (error) throw error;
};
