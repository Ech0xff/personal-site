import { z } from "zod";

import { deskItemSchema } from "./desk-item.schema";

export const breakpointSchema = z.enum(["desktop", "tablet", "phone"]);
export type DeskBreakpoint = z.infer<typeof breakpointSchema>;
export const positionSchema = z.object({
  x: z.number().finite().min(0).max(100000),
  y: z.number().finite().min(0).max(100000),
});
export const placementSchema = positionSchema.extend({
  scale: z.number().min(0.5).max(2),
});
export const layoutSchema = z.object({
  width: z.number().min(240).max(4000),
  height: z.number().min(200).max(100000),
  placements: z.record(z.string(), placementSchema),
});
export const layoutsSchema = z.object({
  desktop: layoutSchema,
  tablet: layoutSchema,
  phone: layoutSchema,
});
export const deskConfigurationSchema = z.object({
  items: z
    .array(deskItemSchema)
    .min(1)
    .max(30)
    .refine(
      (items) => new Set(items.map((item) => item.id)).size === items.length,
      "Item IDs must be unique.",
    ),
  layouts: layoutsSchema,
});
const personalLayoutSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  positions: z.record(z.string(), positionSchema),
});
export const personalLayoutsSchema = z.object({
  desktop: personalLayoutSchema.optional(),
  tablet: personalLayoutSchema.optional(),
  phone: personalLayoutSchema.optional(),
});
export type DeskConfiguration = z.infer<typeof deskConfigurationSchema>;
export type DeskLayout = z.infer<typeof layoutSchema>;
export type DeskPlacement = Readonly<z.infer<typeof placementSchema>>;
export type PersonalLayouts = z.infer<typeof personalLayoutsSchema>;
