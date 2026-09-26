import { z } from "zod";

import { createAudioUpload } from "#lib/server/audio/audio.actions";
import type { ActionResult } from "#lib/shared/actions/action.type";
import type { audioImportSchema } from "#lib/shared/audio/audio.schema";
import {
  AUDIO_BUCKET,
  audioUploadSchema,
} from "#lib/shared/audio/audio.schema";

import { makeUploadClient } from "../files/storage.client";
const resultSchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), data: z.object({ id: z.string() }) }),
  z.object({
    ok: z.literal(false),
    error: z.string(),
    unauthorized: z.boolean().optional(),
  }),
]);
export async function startAudioImport(
  input: z.infer<typeof audioImportSchema>,
): Promise<ActionResult<string>> {
  const response = await fetch("/api/admin/audio/import", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const result = resultSchema.parse(await response.json());
  return result.ok
    ? { ok: true, data: result.data.id }
    : {
        ...result,
        unauthorized: result.unauthorized || response.status === 401,
      };
}
export async function uploadAudio(file: File): Promise<ActionResult<string>> {
  audioUploadSchema.parse(file);
  const result = await createAudioUpload({ name: file.name, size: file.size });
  if (!result.ok) return result;
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
