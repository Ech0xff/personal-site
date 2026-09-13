import "server-only";
import { randomUUID } from "node:crypto";

import { z } from "zod";

import { makeFilePath } from "#lib/shared/files/file.helper";
import {
  FILE_BUCKET,
  fileUploadSchema,
  fileQuerySchema,
  type FilePage,
} from "#lib/shared/files/file.schema";

import { requireAdmin } from "../auth/session.service";
import { makeAdminClient } from "../supabase.client";

export async function listFiles(input: unknown): Promise<FilePage> {
  await requireAdmin();
  const { search, page, sort, direction } = fileQuerySchema.parse(input);
  const client = makeAdminClient();
  const { data, error } = await client.rpc("list_files", {
    search_query: search,
    page_index: page,
    sort_by: sort,
    sort_direction: direction,
  });
  if (error) throw error;
  return {
    hasMore: data.length > 30,
    totalCount: data[0]?.total_count ?? 0,
    totalSize: data[0]?.total_size ?? 0,
    items: data.slice(0, 30).map((file) => ({
      id: file.id,
      name: file.name,
      path: file.path,
      size: file.size,
      type: file.type,
      createdAt: file.created_at,
      url: client.storage.from(FILE_BUCKET).getPublicUrl(file.path).data
        .publicUrl,
    })),
  };
}
export async function signFileUpload(input: unknown) {
  await requireAdmin();
  const file = fileUploadSchema.parse(input);
  const path = makeFilePath(randomUUID(), file.name);
  const bucket = makeAdminClient().storage.from(FILE_BUCKET);
  const { data, error } = await bucket.createSignedUploadUrl(path, {
    upsert: false,
  });
  if (error) throw error;
  return {
    path: data.path,
    token: data.token,
    url: bucket.getPublicUrl(data.path).data.publicUrl,
  };
}
export async function removeFile(input: unknown) {
  await requireAdmin();
  const path = z
    .string()
    .regex(/^[0-9a-f-]{36}-[a-zA-Z0-9._-]+$/, "Invalid file path.")
    .parse(input);
  const { error } = await makeAdminClient()
    .storage.from(FILE_BUCKET)
    .remove([path]);
  if (error) throw error;
}
