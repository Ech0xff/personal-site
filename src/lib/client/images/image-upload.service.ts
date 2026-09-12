import type { SupabaseClient } from "@supabase/supabase-js";

import { fetchExistingPublicUrl } from "#lib/shared/services/images.service";
import { computeHash } from "#lib/shared/utils/hash.helper";
import type { Database } from "#types";

import { compressToWebp } from "./image-compression.service";

const BUCKET_NAME = "images";
const WEBP_EXTENSION = "webp";

export const uploadImage = async (
  client: SupabaseClient<Database>,
  file: File,
) => {
  const compressedFile = await compressToWebp(file);
  const buffer = await compressedFile.arrayBuffer();
  const hash = await computeHash(buffer);
  const filePath = `${hash}.${WEBP_EXTENSION}`;

  const existingUrl = await fetchExistingPublicUrl(filePath, client);
  if (existingUrl) {
    return { url: existingUrl };
  }

  const { error } = await client.storage
    .from(BUCKET_NAME)
    .upload(filePath, compressedFile, {
      contentType: "image/webp",
      upsert: false,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = client.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return { url: publicUrl };
};

export const uploadImageFromUrl = async (
  client: SupabaseClient<Database>,
  url: string,
) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const sourceBlob = await response.blob();
  const compressedFile = await compressToWebp(sourceBlob);
  const arrayBuffer = await compressedFile.arrayBuffer();
  const hash = await computeHash(arrayBuffer);
  const filePath = `${hash}.${WEBP_EXTENSION}`;

  const existingUrl = await fetchExistingPublicUrl(filePath, client);
  if (existingUrl) {
    return { url: existingUrl };
  }

  const { error } = await client.storage
    .from(BUCKET_NAME)
    .upload(filePath, compressedFile, {
      contentType: "image/webp",
      upsert: false,
    });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = client.storage.from(BUCKET_NAME).getPublicUrl(filePath);

  return { url: publicUrl };
};
