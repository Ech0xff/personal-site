import { storedPreference } from "#lib/client/storage/stored-preference.atom";

import {
  emptyGuestbookDraft,
  guestbookDraftSchema,
  guestbookTabSchema,
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
