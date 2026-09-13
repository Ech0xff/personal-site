import { describe, expect, test } from "bun:test";

import { contentInputSchema } from "./content.schema";
import {
  documentText,
  hasDocumentContent,
  migrateMediaRows,
} from "./document.helper";
import { documentSchema, type BlockDocument } from "./document.schema";
import { webUrlSchema } from "./link-metadata.schema";
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

describe("media rows and link cards", () => {
  test("round trips mixed rows and recognizes card-only content", () => {
    const source: BlockDocument = [
      {
        type: "mediaRow",
        props: { columns: 3 },
        children: [
          { type: "image", props: { url: "https://example.com/photo.png" } },
          {
            type: "linkCard",
            props: {
              url: "https://example.com",
              title: "Example",
              description: "A useful website",
            },
          },
          { type: "audio", props: { url: "https://example.com/audio.mp3" } },
        ],
      },
    ];
    expect(documentSchema.parse(JSON.parse(JSON.stringify(source)))).toEqual(
      source,
    );
    expect(hasDocumentContent(source)).toBe(true);
    expect(documentText(source)).toContain("A useful website");
    expect(hasDocumentContent([{ type: "linkCard", props: { url: "" } }])).toBe(
      false,
    );
  });
  test("invalid or empty pasted text fails URL validation without throwing", () => {
    for (const text of ["", "notes", "https://", "javascript:alert(1)"])
      expect(webUrlSchema.safeParse(text).success).toBe(false);
  });
  test("rejects nested rows, text children, unsupported columns and unsafe card URLs", () => {
    for (const children of [
      [{ type: "paragraph", content: "Text" }],
      [{ type: "mediaRow", children: [] }],
    ]) {
      expect(
        documentSchema.safeParse([{ type: "mediaRow", children }]).success,
      ).toBe(false);
    }
    expect(
      documentSchema.safeParse([
        { type: "mediaRow", props: { columns: 4 }, children: [] },
      ]).success,
    ).toBe(false);
    for (const props of [
      { url: "javascript:alert(1)" },
      { url: "https://example.com", image: "javascript:alert(1)" },
    ]) {
      expect(
        documentSchema.safeParse([{ type: "linkCard", props }]).success,
      ).toBe(false);
    }
  });
});

describe("native columns", () => {
  test("migrates legacy rows without losing media, order, or column counts", () => {
    const source: BlockDocument = [
      {
        type: "mediaRow",
        id: "row",
        props: { columns: 2 },
        children: [
          {
            type: "image",
            id: "photo",
            props: { url: "https://example.com/photo.png" },
          },
          {
            type: "linkCard",
            id: "link",
            props: { url: "https://example.com" },
          },
          {
            type: "audio",
            id: "audio",
            props: { url: "https://example.com/audio.mp3" },
          },
        ],
      },
    ];
    const migrated = documentSchema.parse(migrateMediaRows(source));
    expect(migrated.map((block) => block.type)).toEqual([
      "columnList",
      "columnList",
    ]);
    expect(
      migrated.flatMap((row) =>
        row.children?.flatMap((column) =>
          column.children?.map((child) => child.id),
        ),
      ),
    ).toEqual(["photo", "link", "audio", undefined]);
    expect(documentSchema.parse(JSON.parse(JSON.stringify(migrated)))).toEqual(
      migrated,
    );
    expect(hasDocumentContent(migrated)).toBe(true);
    expect(source[0].type).toBe("mediaRow");
  });
  test("rejects orphan columns, invalid widths and malformed column lists", () => {
    expect(
      documentSchema.safeParse([
        { type: "column", children: [{ type: "paragraph" }] },
      ]).success,
    ).toBe(false);
    for (const children of [
      [{ type: "column", children: [{ type: "paragraph" }] }],
      [{ type: "paragraph" }, { type: "paragraph" }],
      [
        {
          type: "column",
          props: { width: -1 },
          children: [{ type: "paragraph" }],
        },
        { type: "column", children: [{ type: "paragraph" }] },
      ],
    ])
      expect(
        documentSchema.safeParse([{ type: "columnList", children }]).success,
      ).toBe(false);
  });
});
