"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { Post, PostInsert } from "@/types";

export async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    return null;
  }

  return data;
}

export async function savePost(
  post: Omit<PostInsert, "created_at" | "updated_at"> & { id?: string },
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = await createClient();
  const isUpdate = !!post.id;

  if (isUpdate) {
    // Update existing post
    const { error } = await supabase
      .from("posts")
      .update({
        title: post.title,
        content: post.content,
        author: post.author,
        status: post.status,
        tags: post.tags,
        updated_at: new Date().toISOString(),
      })
      .eq("id", post.id!);

    if (error) {
      console.error("Error updating post:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/posts");
    revalidatePath("/posts");
    revalidatePath(`/posts/${post.id}`);

    return { success: true, id: post.id };
  } else {
    // Create new post
    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: post.title,
        content: post.content,
        author: post.author,
        status: post.status,
        tags: post.tags,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating post:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/posts");
    revalidatePath("/posts");

    return { success: true, id: data.id };
  }
}

export async function deletePost(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/posts");
  revalidatePath("/posts");

  return { success: true };
}

export async function updatePostStatus(
  id: string,
  status: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error updating post status:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/posts");
  revalidatePath("/posts");
  revalidatePath(`/posts/${id}`);

  return { success: true };
}
