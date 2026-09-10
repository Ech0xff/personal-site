import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import type { Database } from "#types";

import { makeStaticClient } from "../supabase.client";

const BUCKET_NAME = "images";

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
