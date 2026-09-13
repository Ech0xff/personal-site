import { storedPreference } from "#lib/client/storage/stored-preference.atom";

import {
  emptyGuestbookDraft,
  guestbookDraftSchema,
  guestbookEntriesSchema,
  guestbookTabSchema,
  type GuestbookEntry,
} from "./display-content.schema";
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
