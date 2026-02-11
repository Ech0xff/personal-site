import { SupabaseClient } from "@supabase/supabase-js";
import imageCompression from "browser-image-compression";

const BUCKET_NAME = "images";
const WEBP_EXTENSION = "webp";

const compressToWebp = async (file: File | Blob) => {
  const imageFile =
    file instanceof File
      ? file
      : new File([file], "image.png", { type: file.type || "image/png" });

  const compressedFile = await imageCompression(imageFile, {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.85,
  });

  return compressedFile;
};

const computeHash = async (buffer: ArrayBuffer) => {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const getExistingPublicUrl = async (
  client: SupabaseClient,
  filePath: string,
) => {
  const { data } = await client.storage.from(BUCKET_NAME).list("", {
    search: filePath,
  });

  if (data && data.some((file) => file.name === filePath)) {
    const {
      data: { publicUrl },
    } = client.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return publicUrl;
  }

  return null;
};

export const fetchImages = async (client: SupabaseClient) => {
  const { data, error } = await client.storage.from(BUCKET_NAME).list("", {
    limit: 1000,
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) throw error;

  return (data || [])
    .filter((file) => file.name && !file.name.endsWith("/"))
    .map((file) => {
      const {
        data: { publicUrl },
      } = client.storage.from(BUCKET_NAME).getPublicUrl(file.name);

      return {
        id: file.id,
        name: file.name,
        url: publicUrl,
        size: file.metadata?.size || 0,
        createdAt: file.created_at,
      };
    });
};

export const deleteImage = async (client: SupabaseClient, fileName: string) => {
  const { error } = await client.storage.from(BUCKET_NAME).remove([fileName]);
  if (error) throw error;
};

export const uploadImage = async (client: SupabaseClient, file: File) => {
  const compressedFile = await compressToWebp(file);
  const buffer = await compressedFile.arrayBuffer();
  const hash = await computeHash(buffer);
  const filePath = `${hash}.${WEBP_EXTENSION}`;

  const existingUrl = await getExistingPublicUrl(client, filePath);
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
  client: SupabaseClient,
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

  const existingUrl = await getExistingPublicUrl(client, filePath);
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
