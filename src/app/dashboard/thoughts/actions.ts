"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";

export async function deleteThought(id: string): Promise<void> {
  const { error } = await supabase.from("thoughts").delete().eq("id", id);

  if (error) {
    console.error("Error deleting thought:", error);
    return;
  }

  revalidatePath("/dashboard/thoughts");
  revalidatePath("/thoughts");
}
