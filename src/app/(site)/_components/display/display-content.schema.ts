import { z } from "zod";
export const displayProgramSchema = z.enum(["terminal", "stats", "guestbook"]);
export const guestbookTabSchema = z.enum(["read", "write"]);
export type DisplayProgram = z.infer<typeof displayProgramSchema>;
export {
  emptyGuestbookDraft,
  githubUsernameSchema,
  type GuestbookDraft,
  guestbookDraftSchema,
  guestbookEntriesSchema,
  type GuestbookEntry,
  guestbookEntrySchema,
  guestbookSubmissionSchema,
} from "#lib/shared/desk/desk.schema";
