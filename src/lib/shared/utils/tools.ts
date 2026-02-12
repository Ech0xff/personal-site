import { SupabaseClient } from "@supabase/supabase-js";
import imageCompression from "browser-image-compression";

export const compressToWebp = async (file: File | Blob) => {
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

export const computeHash = async (buffer: ArrayBuffer) => {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const formatDate = (dateString: string | null) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatSize = (bytes: number) => {
  if (bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const checkLoggedIn = async (
  client: SupabaseClient,
): Promise<boolean> => {
  const { data } = await client.auth.getSession();
  return !!data.session;
};

export const checkIsAdmin = async (
  client: SupabaseClient,
): Promise<boolean> => {
  const { data } = await client.auth.getSession();
  return data.session?.user.app_metadata.role === "admin";
};
