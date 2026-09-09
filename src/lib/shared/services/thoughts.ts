import type { SupabaseClient } from "@supabase/supabase-js";

import { parseContentStatus } from "#lib/shared/content/status.helper";
import { statusSchema } from "#lib/shared/content/status.schema";
import type { Database, Status, ThoughtInsert } from "#types";

import { makeStaticClient } from "../supabase";

export const fetchThoughts = async (
  client: SupabaseClient<Database> = makeStaticClient(),
) => {
  const { data, error } = await client
    .from("thoughts")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  const items = data.map(parseContentStatus);
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
    .maybeSingle();
  if (error) throw error;
  return data === null ? null : parseContentStatus(data);
};

export const saveThought = async (
  client: SupabaseClient<Database>,
  payload: ThoughtInsert & { id?: string },
) => {
  const status = statusSchema.optional().parse(payload.status);
  if (payload.id) {
    const { id, ...rest } = payload;
    const { data, error } = await client
      .from("thoughts")
      .update({ ...rest, status })
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return parseContentStatus(data);
  }

  const { data, error } = await client
    .from("thoughts")
    .insert({ ...payload, status })
    .select("*")
    .single();
  if (error) throw error;
  return parseContentStatus(data);
};

export const updateThoughtStatus = async (
  client: SupabaseClient<Database>,
  id: string,
  status: Status,
) => {
  const { error } = await client
    .from("thoughts")
    .update({ status: statusSchema.parse(status) })
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
