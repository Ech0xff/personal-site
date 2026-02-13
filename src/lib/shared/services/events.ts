import { SupabaseClient } from "@supabase/supabase-js";

import { Database, EventInsert, EventUpdate, Status } from "@/types";

export const fetchEvents = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });
  if (error) throw error;
  const items = (data || []).map((e) => ({ ...e, tags: e.tags || [] }));
  return items.sort((a, b) => {
    const aTs = new Date(a.published_at || a.event_date || a.created_at || 0).getTime();
    const bTs = new Date(b.published_at || b.event_date || b.created_at || 0).getTime();
    return bTs - aTs;
  });
};

export const fetchEvent = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { data, error } = await client
    .from("events")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data || null;
};

export const saveEvent = async (
  client: SupabaseClient<Database>,
  payload: EventInsert & { id?: string },
) => {
  if (payload.id) {
    const { id, ...rest } = payload;
    const { data, error } = await client
      .from("events")
      .update(rest as EventUpdate)
      .eq("id", id)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await client
    .from("events")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data;
};

export const updateEventStatus = async (
  client: SupabaseClient<Database>,
  id: string,
  status: Status,
) => {
  const { error } = await client.from("events").update({ status }).eq("id", id);
  if (error) throw error;
};

export const deleteEvent = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { error } = await client.from("events").delete().eq("id", id);
  if (error) throw error;
};
