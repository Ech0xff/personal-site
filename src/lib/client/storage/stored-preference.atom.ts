import { atomWithStorage, createJSONStorage } from "jotai/utils";
import type { z } from "zod";

/** Keep storage failures local: preferences remain usable in memory. */
export function storedPreference<Value>(
  key: string,
  initialValue: Value,
  schema: z.ZodType<Value>,
) {
  const storage = createJSONStorage<Value>(
    () => ({
      getItem: (name) => {
        try {
          return globalThis.localStorage.getItem(name);
        } catch {
          return null;
        }
      },
      setItem: (name, value) => {
        try {
          globalThis.localStorage.setItem(name, value);
        } catch {
          /* In-memory fallback. */
        }
      },
      removeItem: (name) => {
        try {
          globalThis.localStorage.removeItem(name);
        } catch {
          /* In-memory fallback. */
        }
      },
    }),
    {
      reviver: (property, value: unknown) => {
        if (property !== "") return value;
        const parsed = schema.safeParse(value);
        return parsed.success ? parsed.data : initialValue;
      },
    },
  );
  storage.subscribe = (name, callback, fallback) => {
    if (typeof window === "undefined") return () => {};
    const onStorage = (event: StorageEvent) => {
      try {
        if (event.storageArea !== window.localStorage) return;
        if (event.key !== name && event.key !== null) return;
        const parsed =
          event.newValue === null
            ? null
            : schema.safeParse(JSON.parse(event.newValue));
        callback(parsed?.success ? parsed.data : fallback);
      } catch {
        callback(fallback);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  };
  return atomWithStorage(key, initialValue, storage);
}
