import { z } from "zod";

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
  email: z.union([
    z.literal(""),
    z.email("Please enter a valid email.").max(160),
  ]),
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
export const emptyGuestbookDraft: GuestbookDraft = {
  name: "",
  email: "",
  githubUsername: "",
  message: "",
};

export const deskStatsSchema = z.object({
  posts: z.number().int().nonnegative(),
  thoughts: z.number().int().nonnegative(),
  events: z.number().int().nonnegative(),
  likes: z.number().int().nonnegative(),
  visits: z.number().int().nonnegative(),
});
export const guestbookPageSchema = z.object({
  entries: z.array(guestbookEntrySchema),
  total: z.number().int().nonnegative(),
});
export const managedEntrySchema = guestbookEntrySchema.extend({
  status: z.enum(["show", "hide"]),
});
export type DeskStats = z.infer<typeof deskStatsSchema>;
