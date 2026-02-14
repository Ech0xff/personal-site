import { SupabaseClient } from "@supabase/supabase-js";
import imageCompression from "browser-image-compression";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

const DEFAULT_TIME_ZONE = "America/New_York";
const DEFAULT_LOCALE = "en";

dayjs.extend(utc);
dayjs.extend(timezone);

/** The application's default time zone */
export const APP_TIME_ZONE = (() => {
  const envTimeZone =
    process.env.NEXT_PUBLIC_APP_TIMEZONE || process.env.APP_TIMEZONE;

  try {
    dayjs.tz("2026-01-01 00:00", envTimeZone);
    dayjs.tz.setDefault(envTimeZone);
    return envTimeZone;
  } catch {
    dayjs.tz.setDefault(DEFAULT_TIME_ZONE);
    return DEFAULT_TIME_ZONE;
  }
})();

/** Compresses an image file or blob to WebP format */
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

/** Computes the SHA-256 hash of an ArrayBuffer */
export const computeHash = async (buffer: ArrayBuffer) => {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

const toDayjs = (dateInput: string | Date | null | undefined) => {
  if (!dateInput) return null;
  const date = dayjs(dateInput).tz(APP_TIME_ZONE);
  return date.isValid() ? date : null;
};

/** Formats a date input into a human-readable string */
export const formatTime = (
  dateInput: string | Date | null | undefined,
  format = "MMM D, YYYY",
  fallback = "—",
) => {
  const date = toDayjs(dateInput);
  if (!date) return fallback;
  return date.locale(DEFAULT_LOCALE).format(format);
};

/** Converts a date input to a local datetime string suitable for input[type="datetime-local"] */
export const toDatetimeLocalValue = (
  dateInput: string | Date | null | undefined,
) => {
  const date = toDayjs(dateInput);
  if (!date) return "";

  return date.format("YYYY-MM-DDTHH:mm");
};

/** Formats a file size in bytes into a human-readable string */
export const formatSize = (bytes: number) => {
  if (bytes === 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/** Checks if a user is logged in */
export const checkLoggedIn = async (
  client: SupabaseClient,
): Promise<boolean> => {
  const { data } = await client.auth.getSession();
  return !!data.session;
};

/** Checks if a user is an admin */
export const checkIsAdmin = async (
  client: SupabaseClient,
): Promise<boolean> => {
  const { data } = await client.auth.getSession();
  return data.session?.user.app_metadata.role === "admin";
};

/** Retrieves the current user's status */
export const getUserStatus = async (client: SupabaseClient) => {
  const {
    data: { session },
  } = await client.auth.getSession();
  const user = session?.user;
  return {
    isAuth: !!session,
    isAdmin: user?.app_metadata.role === "admin",
    metadata: user?.user_metadata || {},
  };
};
