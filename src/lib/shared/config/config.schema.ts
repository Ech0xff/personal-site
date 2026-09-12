import { z } from "zod";

import { OAUTH_PROVIDERS } from "./config.const";

export const stringConfigSchema = z.string();

export const oauthProvidersSchema = z.array(z.enum(OAUTH_PROVIDERS));

export const recentPlansSchema = z.array(
  z
    .object({
      task: z.string(),
      status: z.enum(["waiting", "completed", "pending", "failed"]),
      createdAt: z.string(),
      completedAt: z.string().optional(),
    })
    .strict(),
);
