import { describe, expect, mock, test } from "bun:test";

await mock.module("server-only", () => ({}));
const { renderDocument } = await import("./document-render.service");

describe("dashboard static documents", () => {
  test("renders formatted and nested content without an editable surface", async () => {
    const html = await renderDocument([
      { type: "heading", props: { level: 2 }, content: "A heading" },
      {
        type: "paragraph",
        content: [{ type: "text", text: "Strong", styles: { bold: true } }],
        children: [{ type: "bulletListItem", content: "Nested" }],
      },
      {
        type: "image",
        props: { url: "https://example.com/photo.webp", caption: "A photo" },
      },
    ]);
    expect(html).toContain("<h2");
    expect(html).toContain("<strong>Strong</strong>");
    expect(html).toContain("Nested");
    expect(html).toContain("https://example.com/photo.webp");
    expect(html).toContain('data-viewer-trigger=""');
    expect(html).toContain('data-src="https://example.com/photo.webp"');
    expect(html).toContain('type="button"');
    expect(html).toContain('aria-label="Preview');
    expect(html).not.toContain('contenteditable="true"');
  });
  test("escapes text and rejects executable links", async () => {
    const html = await renderDocument([
      { type: "paragraph", content: '<script>alert("x")</script>' },
    ]);
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
    const result = await renderDocument([
      {
        type: "paragraph",
        content: [{ type: "link", href: "javascript:alert(1)", content: [] }],
      },
    ]).then(
      () => null,
      (error: unknown) => error,
    );
    expect(result).toBeInstanceOf(Error);
  });
  test("escapes image preview attributes without changing the source document", async () => {
    const source = [
      {
        type: "image" as const,
        props: {
          url: "https://example.com/photo.webp?a=1&b=2",
          name: 'Photo " onclick="alert(1)',
          caption: "A <photo>",
        },
      },
    ];
    const html = await renderDocument(source);
    expect(html).toContain(
      'data-src="https://example.com/photo.webp?a=1&amp;b=2"',
    );
    expect(html).not.toContain(' onclick="');
    expect(html).toContain("A &lt;photo&gt;");
    expect(source[0].props.name).toBe('Photo " onclick="alert(1)');
  });
  test("keeps concurrent documents separate and restores DOM globals", async () => {
    const previousDocument = globalThis.document;
    const html = await Promise.all(
      ["First", "Second"].map((content) =>
        renderDocument([{ type: "paragraph", content }]),
      ),
    );
    expect(html[0]).toContain("First");
    expect(html[0]).not.toContain("Second");
    expect(html[1]).toContain("Second");
    expect(globalThis.document).toBe(previousDocument);
  });
});

describe("public article documents", () => {
  test("renders the title once and preserves nested headings with stable, unique anchors", async () => {
    const { renderArticleDocument } = await import("./document-render.service");
    const document = [
      {
        type: "heading" as const,
        content: "Article title",
        children: [{ type: "paragraph" as const, content: "Title child" }],
      },
      {
        id: "duplicate",
        type: "heading" as const,
        content: "Repeated",
        children: [
          {
            type: "heading" as const,
            props: { level: 3 as const },
            content: "Nested",
          },
        ],
      },
      { id: "duplicate", type: "heading" as const, content: "Repeated" },
      {
        type: "paragraph" as const,
        content: '<h2 id="bad">Not a heading</h2>',
      },
    ];
    const first = await renderArticleDocument(document);
    const second = await renderArticleDocument(document);
    expect(first.headings).toEqual(second.headings);
    expect(new Set(first.headings.map(({ id }) => id)).size).toBe(3);
    expect(first.html).not.toContain("Article title");
    expect(first.html).toContain("Title child");
    expect(first.html).not.toContain('<h2 id="bad">');
    for (const heading of first.headings)
      expect(first.html).toContain(`id="${heading.id}"`);
    expect(document[0].content).toBe("Article title");
  });
  test("content changes produce new rendered results and heading-free articles omit the TOC", async () => {
    const { renderArticleDocument } = await import("./document-render.service");
    const first = await renderArticleDocument([
      { type: "heading", content: "Title" },
      { type: "paragraph", content: "Original" },
    ]);
    const next = await renderArticleDocument([
      { type: "heading", content: "Title" },
      { type: "paragraph", content: "Updated" },
    ]);
    expect(first.headings).toEqual([]);
    expect(next.html).toContain("Updated");
    expect(next.html).not.toContain("Original");
  });
});
