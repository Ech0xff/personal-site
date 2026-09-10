import type { SupabaseClient } from "@supabase/supabase-js";

import { parseContentStatus } from "#lib/shared/content/status.helper";
import { statusSchema } from "#lib/shared/content/status.schema";
import type { Database, PostInsert, PostWithTags, Status } from "#types";

import { makeStaticClient } from "../supabase.client";
import { formatTags } from "./tag-join.helper";

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
  return data.map((row) => parseContentStatus(formatTags(row)));
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
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  return parseContentStatus(formatTags(data));
};

export const savePost = async (
  client: SupabaseClient<Database>,
  payload: PostInsert & { id?: string; tagIds?: string[] },
) => {
  const status = statusSchema.optional().parse(payload.status);
  const { tagIds, ...postPayload } = { ...payload, status };
  let post: PostRow;

  if (payload.id) {
    const rest = { ...postPayload };
    delete rest.id;
    const { data, error } = await client
      .from("posts")
      .update(rest)
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

  return parseContentStatus(post);
};

export const updatePostStatus = async (
  client: SupabaseClient<Database>,
  id: string,
  status: Status,
) => {
  const { error } = await client
    .from("posts")
    .update({ status: statusSchema.parse(status) })
    .eq("id", id);
  if (error) throw error;
};

export const deletePost = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { error } = await client.from("posts").delete().eq("id", id);
  if (error) throw error;
};
