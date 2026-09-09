import { z } from "zod";

import type { OAuthProvider, RecentPlan } from "./config.type";

export const stringConfigSchema = z.string();

export const oauthProvidersSchema: z.ZodType<OAuthProvider[]> = z.array(
  z.enum(["github", "google"]),
);

export const recentPlansSchema: z.ZodType<RecentPlan[]> = z.array(
  z
    .object({
      task: z.string(),
      status: z.enum(["waiting", "completed", "pending", "failed"]),
      createdAt: z.string(),
      completedAt: z.string().optional(),
    })
    .strict(),
);
