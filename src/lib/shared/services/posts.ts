import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "@/types";

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
  uuid: string,
) => {
  const { data, error } = await client
    .from("posts")
    .select("*")
    .eq("uuid", uuid)
    .single();
  if (error) throw error;
  return data || null;
};
