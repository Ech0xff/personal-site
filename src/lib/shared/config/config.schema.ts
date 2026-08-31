import { z } from "zod";

import type { PartialDictionary } from "../i18n";
import { dictionary } from "../i18n/messages/default";
import type { OAuthProvider, RecentPlan } from "./config.type";

const makePartialSchema = (value: unknown): z.ZodTypeAny => {
  if (typeof value === "string") return z.string();
  if (typeof value === "number") return z.number();
  if (typeof value === "boolean") return z.boolean();
  if (value === null) return z.null();
  if (Array.isArray(value)) {
    const item = value[0];
    return z.array(item === undefined ? z.never() : makePartialSchema(item));
  }
  if (typeof value === "object") {
    return z
      .object(
        Object.fromEntries(
          Object.entries(value).map(([key, child]) => [
            key,
            makePartialSchema(child),
          ]),
        ),
      )
      .strict()
      .partial();
  }
  return z.never();
};

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

export const dictionaryOverrideSchema = makePartialSchema(
  dictionary,
) as z.ZodType<PartialDictionary>;
