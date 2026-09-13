import { z } from "zod";

import {
  deskStatsSchema,
  guestbookPageSchema,
  guestbookSubmissionSchema,
  type GuestbookDraft,
} from "#lib/shared/desk/desk.schema";

import { makeDeskClient } from "./supabase.client";
export async function readDeskStats(signal: AbortSignal) {
  const { data, error } = await makeDeskClient()
    .rpc("read_desk_stats")
    .abortSignal(signal);
  if (error) throw error;
  return deskStatsSchema.parse(data);
}
export async function likeDesk() {
  const { data, error } = await makeDeskClient().rpc("like_desk");
  if (error) throw error;
  return z.number().int().nonnegative().parse(data);
}
export async function recordVisit(path: string) {
  const { error } = await makeDeskClient().rpc("visit_desk", {
    page_path: path,
  });
  if (error) throw error;
}
export async function readGuestbook(page: number, signal: AbortSignal) {
  const { data, error } = await makeDeskClient()
    .rpc("read_guestbook", { page_index: page })
    .abortSignal(signal);
  if (error) throw error;
  return guestbookPageSchema.parse(data);
}
export async function submitGuestbook(draft: GuestbookDraft) {
  const entry = guestbookSubmissionSchema.parse(draft);
  const { data, error } = await makeDeskClient().rpc("submit_guestbook", {
    author_name: entry.name,
    author_email: entry.email,
    github_username: entry.githubUsername ?? "",
    message_text: entry.message,
  });
  if (error) throw error;
  return z
    .discriminatedUnion("ok", [
      z.object({ ok: z.literal(true) }),
      z.object({ ok: z.literal(false), error: z.string() }),
    ])
    .parse(data);
}
