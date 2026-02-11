import {
  deleteImage,
  fetchImages,
  uploadImage,
  uploadImageFromUrl,
} from "@/lib/shared/services";

import { makeBrowserClient } from "../supabase";

export const fetchImagesByBrowser = async () => {
  const client = makeBrowserClient();
  return fetchImages(client);
};

export const deleteImageByBrowser = async (fileName: string) => {
  const client = makeBrowserClient();
  await deleteImage(client, fileName);
};

export const uploadImageByBrowser = async (file: File) => {
  const client = makeBrowserClient();
  return uploadImage(client, file);
};

export const uploadImageFromUrlByBrowser = async (url: string) => {
  const client = makeBrowserClient();
  return uploadImageFromUrl(client, url);
};

export const isValidImageFile = (file: File) => {
  return file.type.startsWith("image/") && file.size > 0;
};

export const isValidImageUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
