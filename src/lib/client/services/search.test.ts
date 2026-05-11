import assert from "node:assert/strict";
import test from "node:test";

import { normalizeSearchRows, type SearchRpcRow } from "./search";

const rowWithDirectiveSyntax: SearchRpcRow = {
  id: "post-1",
  type: "post",
  title: "World Hello!",
  snippet:
    'A visible sentence with :ref[generic link]{id="post-2" type="post"} only in source syntax.',
  published_at: "2025-01-01T00:00:00.000Z",
};

test("normalizeSearchRows maps unified rpc rows into sorted search results", () => {
  const rows: SearchRpcRow[] = [
    {
      id: "thought-1",
      type: "thought",
      title: null,
      snippet: "Search idea in a quick note",
      published_at: "2025-02-01T00:00:00.000Z",
    },
    {
      id: "post-1",
      type: "post",
      title: "Search architecture",
      snippet: "Detailed implementation notes",
      published_at: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "event-1",
      type: "event",
      title: "Weekly recap",
      snippet: "Search planning session",
      published_at: "2025-01-01T00:00:00.000Z",
    },
  ];

  assert.deepEqual(normalizeSearchRows(rows, "search"), [
    {
      id: "post-1",
      type: "post",
      title: "Search architecture",
      snippet: "Detailed implementation notes",
      href: "/posts/post-1",
      publishedAt: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "thought-1",
      type: "thought",
      title: "",
      snippet: "Search idea in a quick note",
      href: "/thoughts#thought-1",
      publishedAt: "2025-02-01T00:00:00.000Z",
    },
    {
      id: "event-1",
      type: "event",
      title: "Weekly recap",
      snippet: "Search planning session",
      href: "/events#event-1",
      publishedAt: "2025-01-01T00:00:00.000Z",
    },
  ]);
});

test("normalizeSearchRows strips markdown and content directives from previews", () => {
  const rows: SearchRpcRow[] = [
    {
      id: "post-1",
      type: "post",
      title: '**Search** :ref[related post]{id="post-2" type="post"}',
      snippet:
        'Read [the docs](/docs), see :ref[thought note]{id="thought-1" type="thought"}, and ignore :meta{url="https://example.com"}.',
      published_at: "2025-01-01T00:00:00.000Z",
    },
  ];

  assert.deepEqual(normalizeSearchRows(rows, "search"), [
    {
      id: "post-1",
      type: "post",
      title: "Search related post",
      snippet: "Read the docs, see thought note, and ignore.",
      href: "/posts/post-1",
      publishedAt: "2025-01-01T00:00:00.000Z",
    },
  ]);
});

test("normalizeSearchRows filters matches that only come from hidden syntax", () => {
  assert.deepEqual(normalizeSearchRows([rowWithDirectiveSyntax], ":ref"), []);
});

test("normalizeSearchRows can include hidden syntax matches when raw search is enabled", () => {
  assert.deepEqual(
    normalizeSearchRows([rowWithDirectiveSyntax], ":ref", {
      searchRawText: true,
    }),
    [
      {
        id: "post-1",
        type: "post",
        title: "World Hello!",
        snippet: "A visible sentence with generic link only in source syntax.",
        rawTitle: "World Hello!",
        rawSnippet:
          'A visible sentence with :ref[generic link]{id="post-2" type="post"} only in source syntax.',
        href: "/posts/post-1",
        publishedAt: "2025-01-01T00:00:00.000Z",
      },
    ],
  );
});
