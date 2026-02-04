"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { Event, EventInsert } from "@/types";

export async function getEvent(id: string): Promise<Event | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching event:", error);
    return null;
  }

  return data;
}

export async function saveEvent(
  event: Omit<EventInsert, "created_at" | "updated_at"> & { id?: string },
): Promise<{ success: boolean; id?: string; error?: string }> {
  const supabase = await createClient();
  const isUpdate = !!event.id;

  if (isUpdate) {
    const { error } = await supabase
      .from("events")
      .update({
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        tags: event.tags,
        color: event.color,
        status: event.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", event.id!);

    if (error) {
      console.error("Error updating event:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/event");
    revalidatePath("/events");

    return { success: true, id: event.id };
  } else {
    const { data, error } = await supabase
      .from("events")
      .insert({
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        tags: event.tags,
        color: event.color,
        status: event.status,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error creating event:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/dashboard/event");
    revalidatePath("/events");

    return { success: true, id: data.id };
  }
}

export async function deleteEvent(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/event");
  revalidatePath("/events");

  return { success: true };
}
