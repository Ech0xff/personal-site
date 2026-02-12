import { SupabaseClient } from "@supabase/supabase-js";

import { Database, PostInsert, PostUpdate, Status } from "@/types";

export const fetchPosts = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const fetchPost = async (
  client: SupabaseClient<Database>,
  id: string,
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
