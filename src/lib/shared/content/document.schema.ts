import { z } from "zod";

import type { CmsBlock } from "./blocknote.schema";
import { webUrlSchema } from "./link-metadata.schema";

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

export const blockSchema: z.ZodType<CmsBlock> = z.lazy(() => {
  const base = {
    id: z.string().min(1).optional(),
    props: props.optional(),
    children: z.array(blockSchema).optional(),
  };
  return z.discriminatedUnion("type", [
    z.object({
      id: base.id,
      type: z.literal("columnList"),
      props: z.object({}).optional(),
      children: z
        .array(blockSchema)
        .min(2)
        .max(100)
        .refine(
          (children) => children.every((child) => child.type === "column"),
          "Column lists require columns.",
        ),
    }),
    z.object({
      id: base.id,
      type: z.literal("column"),
      props: z.object({ width: z.number().positive().optional() }).optional(),
      children: z
        .array(blockSchema)
        .min(1)
        .refine(
          (children) =>
            children.every(
              (child) => child.type !== "column" && child.type !== "columnList",
            ),
          "Columns require ordinary blocks.",
        ),
    }),
    z.object({
      id: base.id,
      type: z.literal("linkCard"),
      props: z.object({
        url: z.union([z.literal(""), webUrlSchema]),
        title: z.string().max(500).optional(),
        description: z.string().max(2000).optional(),
        siteName: z.string().max(200).optional(),
        image: z.union([z.literal(""), webUrlSchema]).optional(),
        icon: z.union([z.literal(""), webUrlSchema]).optional(),
      }),
      children: z.array(z.never()).optional(),
    }),
    z.object({
      id: base.id,
      type: z.literal("mediaRow"),
      props: z
        .object({ columns: z.union([z.literal(2), z.literal(3)]).optional() })
        .optional(),
      children: z
        .array(blockSchema)
        .max(100)
        .refine(
          (children) =>
            children.every(
              (child) =>
                ["image", "video", "audio", "file", "linkCard"].includes(
                  child.type ?? "",
                ) && !child.children?.length,
            ),
          "Media rows only accept media and link cards.",
        ),
    }),
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
export const documentSchema = z
  .array(blockSchema)
  .max(5000)
  .superRefine((blocks, context) => {
    const visit = (items: readonly CmsBlock[], parent?: CmsBlock["type"]) => {
      for (const block of items) {
        if (block.type === "column" && parent !== "columnList")
          context.addIssue({
            code: "custom",
            message: "Columns must belong to a column list.",
          });
        visit(block.children ?? [], block.type);
      }
    };
    visit(blocks);
  });
export type BlockDocument = z.infer<typeof documentSchema>;
