import { z } from "zod";

import { createAudioUpload } from "#lib/server/audio/audio.actions";
import type { audioImportSchema } from "#lib/shared/audio/audio.schema";
import {
  AUDIO_BUCKET,
  audioUploadSchema,
} from "#lib/shared/audio/audio.schema";

import { makeUploadClient } from "../files/storage.client";
const resultSchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), data: z.object({ id: z.string() }) }),
  z.object({ ok: z.literal(false), error: z.string() }),
]);
export async function startAudioImport(
  input: z.infer<typeof audioImportSchema>,
): Promise<string> {
  const response = await fetch("/api/admin/audio/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const result = resultSchema.parse(await response.json());
  if (!result.ok) throw new Error(result.error);
  return result.data.id;
}
export async function uploadAudio(file: File): Promise<string> {
  audioUploadSchema.parse(file);
  const result = await createAudioUpload({ name: file.name, size: file.size });
  if (!result.ok) throw new Error(result.error);
  const { id, path, token } = result.data;
  const { error } = await makeUploadClient()
    .storage.from(AUDIO_BUCKET)
    .uploadToSignedUrl(path, token, file, {
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });
  if (error) throw new Error("Upload failed. Select the file again to retry.");
  return startAudioImport({ kind: "upload", id });
}
