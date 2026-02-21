import { SupabaseClient } from "@supabase/supabase-js";

import { Database, PostInsert, PostUpdate, Status } from "@/types";

import { makeStaticClient } from "../supabase";

export const fetchPosts = async (
  client: SupabaseClient<Database> = makeStaticClient(),
) => {
  const { data, error } = await client
    .from("posts")
    .select("*")
    .order("published_at", { ascending: false });
  if (error) throw error;
  const items = data || [];
  return items.sort((a, b) => {
    const aTs = new Date(a.published_at || 0).getTime();
    const bTs = new Date(b.published_at || 0).getTime();
    return bTs - aTs;
  });
};

export const fetchPost = async (
  id: string,
  client: SupabaseClient<Database> = makeStaticClient(),
) => {
  const { data, error } = await client
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data || null;
};

export const savePost = async (
  client: SupabaseClient<Database>,
  payload: PostInsert & { id?: string },
) => {
  if (payload.id) {
    const { id, ...rest } = payload;
    const { data, error } = await client
      .from("posts")
      .update(rest as PostUpdate)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await client
    .from("posts")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data;
};

export const updatePostStatus = async (
  client: SupabaseClient<Database>,
  id: string,
  status: Status,
) => {
  const { error } = await client.from("posts").update({ status }).eq("id", id);
  if (error) throw error;
};

export const deletePost = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { error } = await client.from("posts").delete().eq("id", id);
  if (error) throw error;
};
