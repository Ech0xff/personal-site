import { z } from "zod";

export const userMetadataSchema = z.object({
  nickname: z.string().catch(""),
  avatar_url: z.string().catch(""),
});

export const appMetadataSchema = z.object({
  role: z.string().catch(""),
});
