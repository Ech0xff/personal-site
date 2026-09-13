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
