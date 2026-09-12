import { z } from "zod";

export const cardAttributesSchema = z.object({
  title: z
    .string()
    .nullish()
    .transform((title) => title ?? "Card"),
  tone: z.enum(["tip", "success", "warn", "danger", "info"]).optional(),
});

export const metaAttributesSchema = z.object({
  url: z.url({ protocol: /^https?$/ }),
});

export const refAttributesSchema = z.object({
  id: z.string().min(1),
  title: z.string().optional(),
  type: z.enum(["post", "thought", "event", "external", "file"]),
});
