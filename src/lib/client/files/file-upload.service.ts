import { createFileUpload } from "#lib/server/files/files.actions";
import { shouldCompressImage } from "#lib/shared/files/file.helper";
import { FILE_BUCKET, fileUploadSchema } from "#lib/shared/files/file.schema";

import { compressToWebp } from "../images/image-compression.service";
import { makeUploadClient } from "./storage.client";

export async function uploadFile(source: File): Promise<string> {
  const validation = fileUploadSchema.safeParse({
    name: source.name,
    type: source.type,
    size: source.size,
  });
  if (!validation.success)
    throw new Error(validation.error.issues[0]?.message ?? "Invalid file.");
  const file = shouldCompressImage(source.type)
    ? new File(
        [await compressToWebp(source)],
        `${source.name.replace(/\.[^.]+$/, "")}.webp`,
        { type: "image/webp" },
      )
    : source;
  const result = await createFileUpload({
    name: file.name,
    type: file.type,
    size: file.size,
  });
  if (!result.ok) throw new Error(result.error);
  const { error } = await makeUploadClient()
    .storage.from(FILE_BUCKET)
    .uploadToSignedUrl(result.data.path, result.data.token, file, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
      metadata: { originalName: file.name },
    });
  if (error)
    throw new Error("Upload failed. Please try again.", { cause: error });
  return result.data.url;
}
