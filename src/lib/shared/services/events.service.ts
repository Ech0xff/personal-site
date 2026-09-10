import type { SupabaseClient } from "@supabase/supabase-js";

import { parseContentStatus } from "#lib/shared/content/status.helper";
import { statusSchema } from "#lib/shared/content/status.schema";
import type { Database, EventInsert, EventWithTags, Status } from "#types";

import { makeStaticClient } from "../supabase.client";
import { formatTags } from "./tag-join.helper";

type EventRow = Database["public"]["Tables"]["events"]["Row"];

export const fetchEvents = async (
  client: SupabaseClient<Database> = makeStaticClient(),
): Promise<EventWithTags[]> => {
  const { data, error } = await client
    .from("events")
    .select(`
      *,
      tags:event_tags (
        tags (
          id,
          name,
          meta,
          created_at
        )
      )
    `)
    .order("published_at", { ascending: false });
  if (error) throw error;
  const items = data.map((row) => parseContentStatus(formatTags(row)));
  return items.sort((a, b) => {
    const aTs = new Date(a.published_at || 0).getTime();
    const bTs = new Date(b.published_at || 0).getTime();
    return bTs - aTs;
  });
};

export const fetchEvent = async (
  id: string,
  client: SupabaseClient<Database> = makeStaticClient(),
): Promise<EventWithTags | null> => {
  const { data, error } = await client
    .from("events")
    .select(`
      *,
      tags:event_tags (
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

export const saveEvent = async (
  client: SupabaseClient<Database>,
  payload: EventInsert & { id?: string; tagIds?: string[] },
) => {
  const status = statusSchema.optional().parse(payload.status);
  const { tagIds, ...eventPayload } = { ...payload, status };
  let event: EventRow;

  if (payload.id) {
    const rest = { ...eventPayload };
    delete rest.id;
    const { data, error } = await client
      .from("events")
      .update(rest)
      .eq("id", payload.id)
      .select("*")
      .single();
    if (error) throw error;
    event = data;
  } else {
    const { data, error } = await client
      .from("events")
      .insert(eventPayload)
      .select("*")
      .single();
    if (error) throw error;
    event = data;
  }

  if (tagIds !== undefined) {
    const { error: deleteError } = await client
      .from("event_tags")
      .delete()
      .eq("event_id", event.id);
    if (deleteError) throw deleteError;

    if (tagIds.length > 0) {
      const { error: insertError } = await client.from("event_tags").insert(
        tagIds.map((tagId) => ({
          event_id: event.id,
          tag_id: tagId,
        })),
      );
      if (insertError) throw insertError;
    }
  }

  return parseContentStatus(event);
};

export const updateEventStatus = async (
  client: SupabaseClient<Database>,
  id: string,
  status: Status,
) => {
  const { error } = await client
    .from("events")
    .update({ status: statusSchema.parse(status) })
    .eq("id", id);
  if (error) throw error;
};

export const deleteEvent = async (
  client: SupabaseClient<Database>,
  id: string,
) => {
  const { error } = await client.from("events").delete().eq("id", id);
  if (error) throw error;
};
