import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { compressToWebp, computeHash } from "#lib/shared/utils";
import type { Database } from "#types";

import { makeStaticClient } from "../supabase";

const BUCKET_NAME = "images";
const WEBP_EXTENSION = "webp";

const imageMetadataSchema = z.object({
  size: z.number().nonnegative().default(0),
});

export const fetchExistingPublicUrl = async (
  filePath: string,
  client: SupabaseClient<Database> = makeStaticClient(),
) => {
  const { data } = await client.storage.from(BUCKET_NAME).list("", {
    search: filePath,
  });

  if (data?.some((file) => file.name === filePath)) {
    const {
      data: { publicUrl },
    } = client.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return publicUrl;
  }

  return null;
};

export const fetchImages = async (
  client: SupabaseClient<Database> = makeStaticClient(),
) => {
  const { data, error } = await client.storage.from(BUCKET_NAME).list("", {
    limit: 1000,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) throw error;

  return data.flatMap((file) => {
    if (
      file.id === null ||
      file.created_at === null ||
      file.name.endsWith("/")
    ) {
      return [];
    }
    const metadata = imageMetadataSchema.parse(file.metadata ?? {});
    const {
      data: { publicUrl },
    } = client.storage.from(BUCKET_NAME).getPublicUrl(file.name);

    return [
      {
        id: file.id,
        name: file.name,
        url: publicUrl,
        size: metadata.size,
        createdAt: file.created_at,
      },
    ];
  });
};

export const deleteImage = async (
  client: SupabaseClient<Database>,
  fileName: string,
) => {
  const { error } = await client.storage.from(BUCKET_NAME).remove([fileName]);
  if (error) throw error;
};

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
