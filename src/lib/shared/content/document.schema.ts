import type { PartialBlock } from "@blocknote/core";
import { z } from "zod";

const safeUrl = z.string().refine((value) => {
  if (!value) return true;
  try {
    return ["https:", "http:", "mailto:"].includes(new URL(value).protocol);
  } catch {
    return value.startsWith("#");
  }
}, "Use an HTTP, HTTPS, or email link.");
const styles = z.object({
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  strike: z.boolean().optional(),
  code: z.boolean().optional(),
  textColor: z.string().optional(),
  backgroundColor: z.string().optional(),
});
const text = z.object({
  type: z.literal("text"),
  text: z.string(),
  styles: styles.default({}),
});
const inline = z.array(
  z.union([
    text,
    z.object({
      type: z.literal("link"),
      href: safeUrl,
      content: z.array(text),
    }),
  ]),
);
const alignment = z.enum(["left", "center", "right", "justify"]);
const props = z.object({
  textColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  textAlignment: alignment.optional(),
  level: z
    .union([
      z.literal(1),
      z.literal(2),
      z.literal(3),
      z.literal(4),
      z.literal(5),
      z.literal(6),
    ])
    .optional(),
  isToggleable: z.boolean().optional(),
  checked: z.boolean().optional(),
  start: z.number().int().optional(),
  language: z.string().optional(),
  name: z.string().optional(),
  url: safeUrl.optional(),
  caption: z.string().optional(),
  showPreview: z.boolean().optional(),
  previewWidth: z.number().nonnegative().optional(),
});
const tableCell = z.object({
  type: z.literal("tableCell"),
  props: z
    .object({
      textColor: z.string().optional(),
      backgroundColor: z.string().optional(),
      textAlignment: alignment.optional(),
      colspan: z.number().int().positive().optional(),
      rowspan: z.number().int().positive().optional(),
    })
    .optional(),
  content: inline.optional(),
});
const table = z.object({
  type: z.literal("tableContent"),
  columnWidths: z
    .array(
      z
        .number()
        .nonnegative()
        .nullish()
        .transform((value) => value ?? undefined),
    )
    .optional(),
  headerRows: z.number().int().nonnegative().optional(),
  headerCols: z.number().int().nonnegative().optional(),
  rows: z
    .array(z.object({ cells: z.union([z.array(tableCell), z.array(inline)]) }))
    .min(1),
});

export const blockSchema: z.ZodType<PartialBlock> = z.lazy(() => {
  const base = {
    id: z.string().min(1).optional(),
    props: props.optional(),
    children: z.array(blockSchema).optional(),
  };
  return z.discriminatedUnion("type", [
    z.object({
      ...base,
      type: z.enum([
        "paragraph",
        "heading",
        "bulletListItem",
        "numberedListItem",
        "checkListItem",
        "toggleListItem",
        "quote",
      ]),
      content: z.union([z.string(), inline]).optional(),
    }),
    z.object({
      ...base,
      type: z.literal("codeBlock"),
      content: z
        .union([
          z.string(),
          z.array(
            z.object({
              type: z.literal("text"),
              text: z.string(),
              styles: z.object({}).strict(),
            }),
          ),
        ])
        .optional(),
    }),
    z.object({
      ...base,
      type: z.enum(["image", "video", "audio", "file", "divider"]),
    }),
    z.object({ ...base, type: z.literal("table"), content: table }),
  ]);
});
export const documentSchema = z.array(blockSchema).max(5000);
export type BlockDocument = z.infer<typeof documentSchema>;
