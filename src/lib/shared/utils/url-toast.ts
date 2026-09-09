const toastTypes = ["info", "success", "error", "warning"] as const;
export type ToastType = (typeof toastTypes)[number];

const isToastType = (value: unknown): value is ToastType =>
  toastTypes.some((type) => type === value);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export type UrlToastPayload = {
  type: ToastType;
  code?: string;
  message?: string;
};

/**
 * Encodes a toast payload into a base64url-encoded JSON string,
 * suitable for use as a single query param value.
 */
export function encodeUrlToast(payload: UrlToastPayload): string {
  const json = JSON.stringify(payload);
  // btoa expects a binary string; encode as UTF-8 then convert
  const utf8 = encodeURIComponent(json).replace(
    /%([0-9A-F]{2})/g,
    (_match: string, hex: string) => String.fromCharCode(parseInt(hex, 16)),
  );
  return btoa(utf8).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decodes a base64url-encoded JSON string back into a UrlToastPayload.
 * Returns null if the string is invalid or cannot be decoded.
 */
export function decodeUrlToast(encoded: string): UrlToastPayload | null {
  try {
    // Restore base64 padding and character substitution
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padding = (4 - (base64.length % 4)) % 4;
    base64 += "=".repeat(padding);

    const utf8 = atob(base64);
    const json = decodeURIComponent(
      utf8
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );
    const parsed: unknown = JSON.parse(json);

    if (!isRecord(parsed)) return null;
    const obj = parsed;
    if (typeof obj.type !== "string") return null;
    if (!isToastType(obj.type)) return null;

    return {
      type: obj.type,
      code: typeof obj.code === "string" ? obj.code : undefined,
      message: typeof obj.message === "string" ? obj.message : undefined,
    };
  } catch {
    return null;
  }
}

/**
 * Appends a toast query param to any URL string.
 * Returns the URL with the toast param added (does not mutate original).
 */
export function appendToastToUrl(
  href: string,
  payload: UrlToastPayload,
): string {
  const url = new URL(href, "http://localhost");
  url.searchParams.set("toast", encodeUrlToast(payload));
  return url.toString();
}

/**
 * Extracts a UrlToastPayload from URLSearchParams.
 * Returns null if no valid toast param is present.
 */
export function readToastFromSearchParams(
  searchParams: URLSearchParams,
): UrlToastPayload | null {
  const raw = searchParams.get("toast");
  if (!raw) return null;
  return decodeUrlToast(raw);
}
