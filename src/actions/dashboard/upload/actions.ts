"use server";

import { makeServerClient } from "@/lib/supabase";

const BUCKET_NAME = "images";

/** Compute SHA-256 hash of the buffer */
async function computeHash(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Check if file already exists in storage */
async function checkFileExists(hash: string): Promise<string | null> {
  const supabase = await makeServerClient();
  const filePath = `${hash}.webp`;

  const { data } = await supabase.storage.from(BUCKET_NAME).list("", {
    search: filePath,
  });

  if (data && data.length > 0 && data.some((f) => f.name === filePath)) {
    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    return publicUrl;
  }

  return null;
}

/** Server action to upload image
 * Receives base64 encoded image data from client */
export async function uploadImageAction(
  base64Data: string,
): Promise<
  | { success: true; url: string; isNew: boolean }
  | { success: false; error: string }
> {
  try {
    // Decode base64 to buffer
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const buffer = bytes.buffer;

    // Compute hash
    const hash = await computeHash(buffer);

    // Check if file already exists
    const existingUrl = await checkFileExists(hash);
    if (existingUrl) {
      return { success: true, url: existingUrl, isNew: false };
    }

    // Upload new file
    const supabase = await makeServerClient();
    const filePath = `${hash}.webp`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, bytes, {
        contentType: "image/webp",
        upsert: false,
      });

    if (error) {
      return { success: false, error: `Failed to upload: ${error.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return { success: true, url: publicUrl, isNew: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/** Server action to upload image from URL
 * Downloads the image on server side */
export async function uploadImageFromUrlAction(
  url: string,
): Promise<
  | { success: true; url: string; isNew: boolean }
  | { success: false; error: string }
> {
  try {
    // If it's already a Supabase Storage URL, return directly
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (supabaseUrl && url.includes(supabaseUrl)) {
      return { success: true, url, isNew: false };
    }

    // Fetch image from URL
    const response = await fetch(url);
    if (!response.ok) {
      return {
        success: false,
        error: `Failed to fetch image: ${response.statusText}`,
      };
    }

    const arrayBuffer = await response.arrayBuffer();

    // Convert to base64 and use the same upload logic
    const bytes = new Uint8Array(arrayBuffer);

    // Compute hash
    const hash = await computeHash(arrayBuffer);

    // Check if file already exists
    const existingUrl = await checkFileExists(hash);
    if (existingUrl) {
      return { success: true, url: existingUrl, isNew: false };
    }

    // Upload new file
    const supabase = await makeServerClient();
    const filePath = `${hash}.webp`;

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, bytes, {
        contentType: "image/webp",
        upsert: false,
      });

    if (error) {
      return { success: false, error: `Failed to upload: ${error.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return { success: true, url: publicUrl, isNew: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}
