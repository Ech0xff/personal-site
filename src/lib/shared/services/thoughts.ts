import { SupabaseClient } from "@supabase/supabase-js";

import { Database, Status, ThoughtInsert, ThoughtUpdate } from "@/types";

import { makeStaticClient } from "../supabase";

export const fetchThoughts = async (
  client: SupabaseClient<Database> = makeStaticClient(),
) => {
  const { data, error } = await client
    .from("thoughts")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  const items = (data || []).map((t) => ({ ...t, images: t.images || [] }));
  return items.sort((a, b) => {
    const aTs = new Date(a.published_at || 0).getTime();
    const bTs = new Date(b.published_at || 0).getTime();
    return bTs - aTs;
  });
};

export const fetchThought = async (
  id: string,
  client: SupabaseClient<Database> = makeStaticClient(),
) => {
  const { data, error } = await client
    .from("thoughts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data || null;
};

export const saveThought = async (
  client: SupabaseClient<Database>,
  payload: ThoughtInsert & { id?: string },
) => {
  if (payload.id) {
    const { id, ...rest } = payload;
    const { data, error } = await client
      .from("thoughts")
      .update(rest as ThoughtUpdate)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await client
    .from("thoughts")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data;
};

export const updateThoughtStatus = async (
  client: SupabaseClient<Database>,
  id: string,
  status: Status,
) => {
  const { error } = await client
    .from("thoughts")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
};

export const deleteThought = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { error } = await client.from("thoughts").delete().eq("id", id);
  if (error) throw error;
};
