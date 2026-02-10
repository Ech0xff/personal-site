"use server";

import { revalidatePath } from "next/cache";

import { authGuard } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

const BUCKET_NAME = "images";

export interface ImageFile {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

/** Delete an image from storage bucket */
export async function deleteImage(
  fileName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { supabase } = await authGuard();

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      return { success: false, error: error.message };
    }
    revalidatePath(ROUTES.DASHBOARD.IMAGES);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    };
  }
}
