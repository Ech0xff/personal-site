"use server";

import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "images";

export interface ImageFile {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

/** Get all images from storage bucket */
export async function getImages(): Promise<{
  success: boolean;
  images?: ImageFile[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.storage.from(BUCKET_NAME).list("", {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Filter out folders and get public URLs
    const images: ImageFile[] = (data || [])
      .filter((file) => file.name && !file.name.endsWith("/"))
      .map((file) => {
        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);

        return {
          id: file.id,
          name: file.name,
          url: publicUrl,
          size: file.metadata?.size || 0,
          createdAt: file.created_at,
        };
      });

    return { success: true, images };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch images",
    };
  }
}

/** Delete an image from storage bucket */
export async function deleteImage(
  fileName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    };
  }
}
