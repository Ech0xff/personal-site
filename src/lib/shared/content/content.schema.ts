import { z } from "zod";

import { hasDocumentContent, documentTitle } from "./document.helper";
import { documentSchema } from "./document.schema";
import { statusSchema } from "./status.schema";

export const contentKindSchema = z.enum(["posts", "thoughts"]);
export type ContentKind = z.infer<typeof contentKindSchema>;
export const contentInputSchema = z
  .object({
    id: z.uuid().optional(),
    kind: contentKindSchema,
    content: documentSchema.refine(
      hasDocumentContent,
      "Add some text or a file before saving.",
    ),
    status: statusSchema,
    published_at: z.iso.datetime({ offset: true }),
  })
  .superRefine((value, context) => {
    const title = documentTitle(value.content);
    if (value.kind === "posts" && !title)
      context.addIssue({
        code: "custom",
        path: ["content"],
        message: "Add a heading to your document for its title.",
      });
    if (title.length > 500)
      context.addIssue({
        code: "custom",
        path: ["content"],
        message: "The document heading is too long.",
      });
  });
export type ContentInput = z.infer<typeof contentInputSchema>;
export type ContentRecord = ContentInput & {
  readonly id: string;
  readonly title: string;
};

export type ContentSummary = Omit<ContentRecord, "content"> & {
  readonly excerpt: string;
  readonly document?: ContentRecord["content"];
};
