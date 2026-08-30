import { z } from "zod";

import type { OAuthProvider } from "../config/types";
import type { PartialDictionary } from "../i18n-new";

export const oauthProvidersSchema: z.ZodType<OAuthProvider[]> = z.array(
  z.enum(["github", "google"]),
);

export const dictionaryOverrideSchema: z.ZodType<PartialDictionary> = z
  .object({
    meta: z
      .object({
        siteTitle: z.string().optional(),
        siteDescription: z.string().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();
