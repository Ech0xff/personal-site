import { z } from "zod";

export const columnLayoutProps = {
  gap: { default: 8 },
  mediaLayout: {
    default: "original",
    values: ["original", "square", "landscape", "wide", "equalHeight"],
  },
  mediaHeight: { default: 240 },
  mediaFit: { default: "cover", values: ["cover", "contain"] },
  equalCards: { default: false },
} as const;

export const columnLayoutSchema = z.object({
  gap: z.number().int().min(0).max(64).default(columnLayoutProps.gap.default),
  mediaLayout: z.enum(columnLayoutProps.mediaLayout.values).default("original"),
  mediaHeight: z.number().int().min(80).max(640).default(240),
  mediaFit: z.enum(columnLayoutProps.mediaFit.values).default("cover"),
  equalCards: z.boolean().default(false),
});
export type ColumnLayout = z.infer<typeof columnLayoutSchema>;
