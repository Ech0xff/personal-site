"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";
import { Thought, ThoughtInsert } from "@/types";

export async function getThought(id: string): Promise<Thought | null> {
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
  const isUpdate = !!thought.id;

  if (isUpdate) {
    const { error } = await supabase
      .from("thoughts")
      .update({
        content: thought.content,
        images: thought.images,
        updated_at: new Date().toISOString(),
      })
      .eq("id", thought.id!);

    if (error) {
      console.error("Error updating thought:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/thoughts");
    revalidatePath("/thoughts");

    return { success: true, id: thought.id };
  } else {
    const { data, error } = await supabase
      .from("thoughts")
      .insert({
        content: thought.content,
        images: thought.images,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating thought:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/thoughts");
    revalidatePath("/thoughts");

    return { success: true, id: data.id };
  }
}

export async function deleteThought(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("thoughts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting thought:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/thoughts");
  revalidatePath("/thoughts");

  return { success: true };
}
