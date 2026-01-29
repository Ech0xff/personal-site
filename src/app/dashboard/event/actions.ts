"use server";

import { revalidatePath } from "next/cache";

import { supabase } from "@/lib/supabase";

export async function deleteEvent(eventId: string) {
  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    console.error("Error deleting event:", error);
  }

  revalidatePath("/dashboard/event");
  revalidatePath("/(index)/events");
}
