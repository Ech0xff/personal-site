import imageCompression from "browser-image-compression";

import {
  uploadImageAction,
  uploadImageFromUrlAction,
} from "@/app/dashboard/actions/upload";

/** Convert image to WebP format and compress it */
async function convertToWebP(file: File | Blob): Promise<Blob> {
  // If it's a Blob, convert to File
  const imageFile =
    file instanceof File
      ? file
      : new File([file], "image.png", { type: file.type || "image/png" });

  const compressedFile = await imageCompression(imageFile, {
    maxSizeMB: 2, // Max 2MB
    maxWidthOrHeight: 1920, // Max width or height 1920px
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.85,
  });

  return compressedFile;
}

/** Convert Blob to base64 string */
async function blobToBase64(blob: Blob): Promise<string> {
  const buffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/** Upload image to server (client compresses, server uploads to storage) */
export async function uploadImage(
  file: File | Blob,
): Promise<{ url: string; isNew: boolean }> {
  // Compress and convert to WebP on client side
  const webpBlob = await convertToWebP(file);

  // Convert to base64 for server transfer
  const base64Data = await blobToBase64(webpBlob);

  // Upload via server action
  const result = await uploadImageAction(base64Data);

  if (!result.success) {
    throw new Error(result.error);
  }

  return { url: result.url, isNew: result.isNew };
}

/** Upload image from URL (server handles download and upload) */
export async function uploadImageFromUrl(
  url: string,
): Promise<{ url: string; isNew: boolean }> {
  const result = await uploadImageFromUrlAction(url);

  if (!result.success) {
    throw new Error(result.error);
  }

  return { url: result.url, isNew: result.isNew };
}

/** Validate if the URL is a valid image URL */
export function isValidImageUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
}

/** Validate if the file is a supported image format */
export function isValidImageFile(file: File): boolean {
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "image/bmp",
    "image/svg+xml",
  ];
  return validTypes.includes(file.type);
}
