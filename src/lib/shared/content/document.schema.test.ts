import { describe, expect, test } from "bun:test";

import { contentInputSchema } from "./content.schema";
import { documentText, hasDocumentContent } from "./document.helper";
import { documentSchema, type BlockDocument } from "./document.schema";
const sample: BlockDocument = [
  {
    id: "heading",
    type: "heading",
    props: { level: 2, textColor: "default" },
    content: [{ type: "text", text: "Hello 世界", styles: { bold: true } }],
    children: [],
  },
  {
    type: "bulletListItem",
    content: "Parent",
    children: [
      { type: "checkListItem", props: { checked: true }, content: "Child" },
    ],
  },
  {
    type: "table",
    content: {
      type: "tableContent",
      columnWidths: [120, 240],
      headerRows: 1,
      rows: [
        {
          cells: [
            {
              type: "tableCell",
              props: {
                colspan: 2,
                backgroundColor: "blue",
                textColor: "default",
                textAlignment: "left",
              },
              content: [{ type: "text", text: "A cell", styles: {} }],
            },
          ],
        },
      ],
    },
  },
  {
    type: "codeBlock",
    props: { language: "typescript" },
    content: [{ type: "text", text: "const answer = 42;", styles: {} }],
  },
  {
    type: "file",
    props: {
      url: "https://example.com/notes.pdf",
      name: "Notes.pdf",
      caption: "Attachment",
    },
  },
  {
    type: "image",
    props: {
      url: "https://example.com/photo.webp",
      previewWidth: 450,
      showPreview: true,
      caption: "Photo",
    },
  },
];
describe("BlockNote content boundaries", () => {
  test("preserves nested blocks, styles, table cells, code, and attachments", () => {
    const parsed = documentSchema.parse(sample);
    expect(parsed).toEqual(sample);
    expect(documentSchema.parse(JSON.parse(JSON.stringify(parsed)))).toEqual(
      parsed,
    );
    expect(documentText(parsed)).toContain("Hello 世界");
    expect(documentText(parsed)).toContain("A cell");
    expect(documentText(parsed)).toContain("Notes.pdf");
    expect(documentText(parsed)).not.toContain("https://example.com");
  });
  test("allows media-only content but rejects blank and pending media", () => {
    expect(hasDocumentContent([{ type: "paragraph", content: "   " }])).toBe(
      false,
    );
    expect(hasDocumentContent([{ type: "image", props: { url: "" } }])).toBe(
      false,
    );
    expect(
      hasDocumentContent([
        { type: "file", props: { url: "https://example.com/file.pdf" } },
      ]),
    ).toBe(true);
    expect(
      hasDocumentContent([
        {
          type: "paragraph",
          children: [{ type: "paragraph", content: "Nested" }],
        },
      ]),
    ).toBe(true);
  });
  test("rejects unsupported blocks and executable URLs", () => {
    expect(
      documentSchema.safeParse([{ type: "legacyDirective" }]).success,
    ).toBe(false);
    expect(
      documentSchema.safeParse([
        { type: "image", props: { url: "javascript:alert(1)" } },
      ]).success,
    ).toBe(false);
    expect(
      documentSchema.safeParse([
        {
          type: "paragraph",
          content: [{ type: "link", href: "data:text/html,evil", content: [] }],
        },
      ]).success,
    ).toBe(false);
  });
  test("events accept body-only and media-only documents while posts still require a heading", () => {
    const base = {
      kind: "events",
      status: "show",
      published_at: "2026-09-13T00:00:00Z",
    };
    for (const content of [
      [{ type: "paragraph", content: "A small moment" }],
      [{ type: "image", props: { url: "https://example.com/photo.webp" } }],
    ]) {
      expect(contentInputSchema.parse({ ...base, content }).title).toBe("");
      expect(
        contentInputSchema.safeParse({ ...base, kind: "posts", content })
          .success,
      ).toBe(false);
    }
    expect(contentInputSchema.safeParse({ ...base, content: [] }).success).toBe(
      false,
    );
    expect(
      contentInputSchema.parse({
        ...base,
        content: [{ type: "heading", content: "Optional event title" }],
      }).title,
    ).toBe("Optional event title");
  });
  test("validates content type metadata and preserves original-language text", () => {
    const input = {
      kind: "posts",
      title: "文章",
      content: sample,
      status: "hide",
      published_at: "2026-09-13T00:00:00Z",
    };
    expect(contentInputSchema.parse(input).title).toBe("Hello 世界");
    expect(
      contentInputSchema.safeParse({
        ...input,
        content: [{ type: "paragraph", content: "No heading" }],
      }).success,
    ).toBe(false);
    expect(
      contentInputSchema.safeParse({ ...input, kind: "thoughts", title: "" })
        .success,
    ).toBe(true);
    expect(
      contentInputSchema.safeParse({
        ...input,
        kind: "events",
        content: [{ type: "heading", content: "x".repeat(256) }],
      }).success,
    ).toBe(false);
    expect(
      contentInputSchema.safeParse({ ...input, content: [] }).success,
    ).toBe(false);
    expect(
      contentInputSchema.safeParse({ ...input, published_at: "invalid" })
        .success,
    ).toBe(false);
  });
});
