import "server-only";
import { z } from "zod";

import { contentRecordSchema } from "#lib/shared/content/content-record.schema";
import {
  contentInputSchema,
  type ContentKind,
  type ContentRecord,
  type ContentSummary,
} from "#lib/shared/content/content.schema";
import { documentText } from "#lib/shared/content/document.helper";
import type { statusSchema } from "#lib/shared/content/status.schema";

import { InputError } from "../actions/action.service";
import { requireAdmin } from "../auth/session.service";
import { makeAdminClient } from "../supabase.client";

export async function listContent(
  kind: ContentKind,
  page = 0,
): Promise<{ items: ContentSummary[]; hasMore: boolean }> {
  await requireAdmin();
  const { data, error } = await makeAdminClient()
    .from(kind)
    .select("*")
    .order("published_at", { ascending: false })
    .order("id")
    .range(page * 30, page * 30 + 30);
  if (error) throw error;
  return {
    items: data.slice(0, 30).map((row) => {
      const { content, ...record } = contentRecordSchema.parse(row);
      return {
        ...record,
        kind,
        excerpt: documentText(content).slice(0, 200),
        ...(kind !== "posts" ? { document: content } : {}),
      };
    }),
    hasMore: data.length > 30,
  };
}
export async function readContent(
  kind: ContentKind,
  id: string,
): Promise<ContentRecord> {
  await requireAdmin();
  const { data, error } = await makeAdminClient()
    .from(kind)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new InputError("This content no longer exists.");
  return { ...contentRecordSchema.parse(data), kind };
}
export async function writeContent(input: unknown) {
  await requireAdmin();
  const { id, kind, title, color, content, ...rest } =
    contentInputSchema.parse(input);
  // JSON serialization removes undefined optional block fields without losing their structure.
  const body = {
    ...rest,
    content: z.json().parse(JSON.parse(JSON.stringify(content))),
  };
  const payload =
    kind === "thoughts"
      ? body
      : kind === "posts"
        ? { ...body, title }
        : { ...body, title, color };
  const client = makeAdminClient();
  const query = id
    ? client.from(kind).update(payload).eq("id", id)
    : client.from(kind).insert(payload);
  const { data, error } = await query.select("id").single();
  if (error) throw error;
  return data.id;
}
export async function removeContent(kind: ContentKind, id: string) {
  await requireAdmin();
  const { error } = await makeAdminClient().from(kind).delete().eq("id", id);
  if (error) throw error;
}
export async function changeContentStatus(
  kind: ContentKind,
  id: string,
  status: z.infer<typeof statusSchema>,
) {
  await requireAdmin();
  const { error } = await makeAdminClient()
    .from(kind)
    .update({ status })
    .eq("id", id)
    .select("id")
    .single();
  if (error) throw error;
}
