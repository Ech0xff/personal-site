import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { z } from "zod";

import {
  displayProgramSchema,
  emptyGuestbookDraft,
  guestbookDraftSchema,
  guestbookEntriesSchema,
  guestbookTabSchema,
  type GuestbookEntry,
} from "./display-content.schema";
import { playbackModeSchema } from "./record-playback.helper";
import {
  defaultRecordSession,
  readRecordSession,
  recordSessionSchema,
  recordStorageKey,
} from "./record-session.helper";

const unavailableStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function browserStorage() {
  try {
    if (typeof globalThis.localStorage === "undefined")
      return unavailableStorage;
    const storage = globalThis.localStorage;
    // The old clock entry was a plain string; migrate it before native JSON reads.
    const clock = storage.getItem("redesign:clock-format:v1");
    if (clock === "12h" || clock === "24h")
      storage.setItem("redesign:clock-format:v1", JSON.stringify(clock));
    return storage;
  } catch {
    return unavailableStorage;
  }
}

function storedPreference<Value>(
  key: string,
  initialValue: Value,
  schema: z.ZodType<Value>,
) {
  const storage = createJSONStorage<Value>(browserStorage, {
    // The native reviver also validates cross-tab storage events.
    reviver: (property, value: unknown) => {
      if (property !== "") return value;
      const parsed = schema.safeParse(value);
      return parsed.success ? parsed.data : initialValue;
    },
  });
  return atomWithStorage(key, initialValue, storage);
}

export const recordSessionAtom = storedPreference(
  recordStorageKey,
  defaultRecordSession,
  recordSessionSchema.transform((value) =>
    readRecordSession(JSON.stringify(value)),
  ),
);
export const recordControlsPinnedAtom = storedPreference(
  "redesign:record-controls-pinned:v1",
  false,
  z.boolean(),
);
export const playbackModeAtom = storedPreference(
  "redesign:record-playback-mode:v1",
  "repeat-all",
  playbackModeSchema,
);
export const lampOnAtom = storedPreference(
  "redesign:lamp-on:v1",
  true,
  z.boolean(),
);
export const clockFormatAtom = storedPreference(
  "redesign:clock-format:v1",
  "24h",
  z.enum(["12h", "24h"]),
);

export const displayProgramAtom = storedPreference(
  "redesign:display-program:v1",
  "terminal",
  displayProgramSchema,
);
export const deskLikedAtom = storedPreference(
  "redesign:desk-liked:v1",
  false,
  z.boolean(),
);
export const guestbookTabAtom = storedPreference(
  "redesign:guestbook-tab:v1",
  "read",
  guestbookTabSchema,
);
export const guestbookDraftAtom = storedPreference(
  "redesign:guestbook-draft:v1",
  emptyGuestbookDraft,
  guestbookDraftSchema,
);
export const guestbookEntriesAtom = storedPreference<GuestbookEntry[]>(
  "redesign:guestbook-entries:v1",
  [],
  guestbookEntriesSchema,
);
