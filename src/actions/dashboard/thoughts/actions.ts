"use server";

import { revalidatePath } from "next/cache";

import { CACHE_TAGS, revalidateTag } from "@/lib/cache";
import { ROUTES } from "@/lib/routes";
import { makeServerClient } from "@/lib/supabase";
import { Thought, ThoughtInsert } from "@/types";

export async function getThought(id: string): Promise<Thought | null> {
  const supabase = await makeServerClient();
  const { data, error } = await supabase
    .from("thoughts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching thought:", error);
    return null;
  }

  return data;
}

export async function saveThought(
  thought: Omit<ThoughtInsert, "created_at" | "updated_at"> & { id?: string },
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = await makeServerClient();
  const isUpdate = !!thought.id;

  if (isUpdate) {
    const { error } = await supabase
      .from("thoughts")
      .update({
        content: thought.content,
        images: thought.images,
        status: thought.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", thought.id!);

    if (error) {
      console.error("Error updating thought:", error);
      return { success: false, error: error.message };
    }

    revalidateTag(CACHE_TAGS.THOUGHTS);
    revalidateTag(CACHE_TAGS.SUMMARY);
    revalidatePath(ROUTES.HOME);
    revalidatePath(ROUTES.DASHBOARD.THOUGHTS);
    revalidatePath(ROUTES.THOUGHTS);

    return { success: true, id: thought.id };
  } else {
    const { data, error } = await supabase
      .from("thoughts")
      .insert({
        content: thought.content,
        images: thought.images,
        status: thought.status,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating thought:", error);
      return { success: false, error: error.message };
    }

    revalidateTag(CACHE_TAGS.THOUGHTS);
    revalidateTag(CACHE_TAGS.SUMMARY);
    revalidatePath(ROUTES.HOME);
    revalidatePath(ROUTES.DASHBOARD.THOUGHTS);
    revalidatePath(ROUTES.THOUGHTS);

    return { success: true, id: data.id };
  }
}

export async function deleteThought(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await makeServerClient();
  const { error } = await supabase.from("thoughts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting thought:", error);
    return { success: false, error: error.message };
  }

  revalidateTag(CACHE_TAGS.THOUGHTS);
  revalidateTag(CACHE_TAGS.SUMMARY);
  revalidatePath(ROUTES.HOME);
  revalidatePath(ROUTES.DASHBOARD.THOUGHTS);
  revalidatePath(ROUTES.THOUGHTS);

  return { success: true };
}

export async function updateThoughtStatus(
  id: string,
  status: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await makeServerClient();
  const { error } = await supabase
    .from("thoughts")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Error updating thought status:", error);
    return { success: false, error: error.message };
  }

  revalidateTag(CACHE_TAGS.THOUGHTS);
  revalidateTag(CACHE_TAGS.SUMMARY);
  revalidatePath(ROUTES.HOME);
  revalidatePath(ROUTES.DASHBOARD.HOME);
  revalidatePath(ROUTES.DASHBOARD.THOUGHTS);
  revalidatePath(ROUTES.THOUGHTS);

  return { success: true };
}
