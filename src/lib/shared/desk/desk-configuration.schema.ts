import { z } from "zod";

import { deskItemSchema } from "./desk-item.schema";

export const deskConfigurationSchema = z.object({
  items: z
    .array(deskItemSchema)
    .min(1)
    .max(8)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      "Item IDs must be unique.",
    )
    .refine(
      (items) => new Set(items.map((item) => item.type)).size === items.length,
      "Each desk item type can only appear once.",
    )
    .readonly(),
});
export type DeskConfiguration = z.infer<typeof deskConfigurationSchema>;
export type { DeskItem, DeskItemType, IntroConfig } from "./desk-item.schema";
