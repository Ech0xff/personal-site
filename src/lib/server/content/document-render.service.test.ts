import { describe, expect, mock, test } from "bun:test";

import { spawn } from "bun";

await mock.module("server-only", () => ({}));
// Next compiles StyleX; these rendering tests exercise HTML, not generated CSS.
await mock.module("#components/ui/blocknote/link-card.style", () => ({
  cardStyles: Object.fromEntries(
    ["card", "copy", "title", "description", "source", "image", "logo"].map(
      (name) => [name, {}],
    ),
  ),
}));
const { renderDocument } = await import("./document-render.service");

test("loads the document renderer with Lambda's native Node module restrictions", async () => {
  const child = spawn(
    [
      "node",
      "--no-experimental-require-module",
      "--input-type=module",
      "-e",
      `import { ServerBlockNoteEditor } from "@blocknote/server-util";
       const editor = ServerBlockNoteEditor.create();
       await editor._withJSDOM(async () => {
         window.localStorage.setItem("renderer-smoke", "ready");
         if (window.localStorage.getItem("renderer-smoke") !== "ready") {
           throw new Error("Renderer DOM storage is unavailable");
         }
       });
       console.log(await editor.blocksToFullHTML([
         { type: "paragraph", content: "Native Node rendering" }
       ]));`,
    ],
    { stdout: "pipe", stderr: "pipe" },
  );
  const [exitCode, html, error] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);
  expect(exitCode, error).toBe(0);
  expect(html).toContain("Native Node rendering");
});

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

describe("custom content HTML", () => {
  test("exports mixed rows, safe card links and image preview buttons", async () => {
    const html = await renderDocument([
      {
        type: "mediaRow",
        props: { columns: 3 },
        children: [
          { type: "image", props: { url: "https://example.com/image.png" } },
          {
            type: "linkCard",
            props: {
              url: "https://example.com",
              title: "<script>Card</script>",
              description: "Description",
              image: "https://example.com/cover.png",
            },
          },
          { type: "video", props: { url: "https://example.com/video.mp4" } },
        ],
      },
    ]);
    expect(html).toContain('data-content-type="mediaRow"');
    expect(html).toContain('data-columns="3"');
    expect(html).toContain('data-content-type="linkCard"');
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).toContain("&lt;script&gt;Card&lt;/script&gt;");
    expect(html).toContain('data-viewer-trigger=""');
    expect(html).not.toContain('data-src="https://example.com/cover.png"');
    expect(html).toContain("Description");
  });
});

test("exports official columns with widths, media controls and saved cards", async () => {
  const html = await renderDocument([
    {
      type: "columnList",
      children: [
        {
          type: "column",
          props: { width: 0.8 },
          children: [
            {
              type: "linkCard",
              props: { url: "https://example.com", title: "Saved preview" },
            },
          ],
        },
        {
          type: "column",
          props: { width: 1.2 },
          children: [
            { type: "image", props: { url: "https://example.com/photo.png" } },
          ],
        },
      ],
    },
  ]);
  expect(html).toContain('data-node-type="columnList"');
  expect(html).toContain('data-width="0.8"');
  expect(html).toContain("Saved preview");
  expect(html).toContain('data-viewer-trigger=""');
});
