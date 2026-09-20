import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";
import { cache } from "react";
import { z } from "zod";

import { contentRecordSchema } from "#lib/shared/content/content-record.schema";
import type {
  ContentKind,
  ContentSummary,
} from "#lib/shared/content/content.schema";
import { documentText } from "#lib/shared/content/document.helper";

import { makePublicClient } from "../supabase.client";
import { contentListTag, publicPostTag } from "./content-cache.helper";

type PublicContentSummary = ContentSummary &
  Readonly<{ characterCount: number }>;

export async function listPublicContent(
  kind: ContentKind,
): Promise<PublicContentSummary[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(contentListTag(kind));
  const client = makePublicClient();
  const items: PublicContentSummary[] = [];
  let total = Infinity;
  while (items.length < total) {
    const { data, error, count } = await client
      .from(kind)
      .select("*", { count: "exact" })
      .eq("status", "show")
      .order("published_at", { ascending: false })
      .order("id")
      .range(items.length, items.length + 249);
    if (error) throw error;
    total = count ?? total;
    if (!data.length) break;
    items.push(
      ...data.map((row) => {
        const { content, ...record } = contentRecordSchema.parse(row);
        const text = documentText(content);
        return {
          ...record,
          kind,
          excerpt: text.slice(0, 200),
          characterCount: Array.from(text.replace(/\s/gu, "")).length,
          ...(kind !== "posts" ? { document: content } : {}),
        };
      }),
    );
  }
  return items;
}

async function readCachedPublicPost(id: string) {
  "use cache";
  cacheLife("hours");
  cacheTag(publicPostTag(id));
  const { data, error } = await makePublicClient()
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("status", "show")
    .maybeSingle();
  if (error) throw error;
  return data ? contentRecordSchema.parse(data) : null;
}

// Deduplicate metadata and body reads, including UUID validation, within a request.
export const readPublicPost = cache(async (id: string) => {
  if (!z.uuid().safeParse(id).success) return null;
  return readCachedPublicPost(id.toLowerCase());
});

export async function readPublicCounts() {
  await connection();
  const client = makePublicClient();
  return Promise.all(
    (["posts", "thoughts"] as const).map(async (kind) => {
      const { count, error } = await client
        .from(kind)
        .select("id", { count: "exact", head: true })
        .eq("status", "show");
      if (error) throw error;
      return {
        label: kind === "posts" ? "Posts" : "Thoughts",
        value: String(count ?? 0),
      };
    }),
  );
}
