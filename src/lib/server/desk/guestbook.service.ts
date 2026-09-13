import "server-only";
import { z } from "zod";

import { managedEntrySchema } from "#lib/shared/desk/desk.schema";

import { makeAdminClient } from "../supabase.client";
export async function listManagedGuestbook(page: number) {
  const { data, error } = await makeAdminClient()
    .from("configs")
    .select("value")
    .eq("key", "desk.guestbook")
    .single();
  if (error) throw error;
  const { entries } = z
    .object({ entries: z.array(managedEntrySchema) })
    .parse(data.value);
  return {
    entries: entries.slice(page * 50, (page + 1) * 50),
    total: entries.length,
  };
}
export async function manageGuestbook(
  id: string,
  operation: "show" | "hide" | "delete",
) {
  const { error } = await makeAdminClient().rpc("manage_guestbook", {
    entry_id: id,
    operation,
  });
  if (error) throw error;
}
