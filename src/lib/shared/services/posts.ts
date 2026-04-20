import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Database,
  PostInsert,
  PostUpdate,
  PostWithTags,
  Status,
} from "@/types";

import { makeStaticClient } from "../supabase";
import { formatTags } from "./utils";

type PostRow = Database["public"]["Tables"]["posts"]["Row"];

export const fetchPosts = async (
  client: SupabaseClient<Database> = makeStaticClient(),
  limit?: number,
): Promise<PostWithTags[]> => {
  let query = client
    .from("posts")
    .select(`
      *,
      tags:post_tags (
        tags (
          id,
          name,
          meta,
          created_at
        )
      )
    `)
    .order("published_at", { ascending: false });

  if (limit !== undefined) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data.map(formatTags);
};

export const fetchPost = async (
  id: string,
  client: SupabaseClient<Database> = makeStaticClient(),
): Promise<PostWithTags | null> => {
  const { data, error } = await client
    .from("posts")
    .select(`
      *,
      tags:post_tags (
        tags (
          id,
          name,
          meta,
          created_at
        )
      )
    `)
    .eq("id", id)
    .single();
  if (error) throw error;
  if (!data) return null;

  return formatTags(data);
};

export const savePost = async (
  client: SupabaseClient<Database>,
  payload: PostInsert & { id?: string; tagIds?: string[] },
) => {
  const { tagIds, ...postPayload } = payload;
  let post: PostRow;

  if (payload.id) {
    const rest = { ...postPayload };
    delete rest.id;
    const { data, error } = await client
      .from("posts")
      .update(rest as PostUpdate)
      .eq("id", payload.id)
      .select("*")
      .single();
    if (error) throw error;
    post = data;
  } else {
    const { data, error } = await client
      .from("posts")
      .insert(postPayload)
      .select("*")
      .single();
    if (error) throw error;
    post = data;
  }

  if (tagIds !== undefined) {
    const { error: deleteError } = await client
      .from("post_tags")
      .delete()
      .eq("post_id", post.id);
    if (deleteError) throw deleteError;

    if (tagIds.length > 0) {
      const { error: insertError } = await client.from("post_tags").insert(
        tagIds.map((tagId) => ({
          post_id: post.id,
          tag_id: tagId,
        })),
      );
      if (insertError) throw insertError;
    }
  }

  return post;
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
