import { z } from "zod";

export const displayProgramSchema = z.enum(["terminal", "stats", "guestbook"]);
export const guestbookTabSchema = z.enum(["read", "write"]);
export const githubUsernameSchema = z
  .string()
  .regex(
    /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i,
    "Please enter a valid GitHub username.",
  );
export const guestbookDraftSchema = z.object({
  name: z.string().max(40),
  email: z.string().max(160),
  githubUsername: z.string().max(39).optional(),
  message: z.string().max(500),
});
export const guestbookSubmissionSchema = guestbookDraftSchema.extend({
  name: z.string().trim().max(40),
  email: z.union([z.literal(""), z.email("Please enter a valid email.")]),
  githubUsername: z
    .string()
    .trim()
    .pipe(z.union([z.literal(""), githubUsernameSchema]))
    .optional(),
  message: z
    .string()
    .trim()
    .min(3, "Please write at least 3 characters.")
    .max(500),
});
export const guestbookEntrySchema = guestbookSubmissionSchema.extend({
  id: z.string().min(1),
  date: z.string().datetime(),
});
export const guestbookEntriesSchema = z.array(guestbookEntrySchema).max(50);
export type GuestbookDraft = Readonly<z.infer<typeof guestbookDraftSchema>>;
export type GuestbookEntry = Readonly<z.infer<typeof guestbookEntrySchema>>;
export type DisplayProgram = z.infer<typeof displayProgramSchema>;
export const emptyGuestbookDraft: GuestbookDraft = {
  name: "",
  email: "",
  githubUsername: "",
  message: "",
};
