import assert from "node:assert/strict";
import test from "node:test";

import { normalizeSearchRows, type SearchRpcRow } from "./search";

test("normalizeSearchRows maps unified rpc rows into sorted search results", () => {
  const rows: SearchRpcRow[] = [
    {
      id: "thought-1",
      type: "thought",
      title: null,
      content: "Search idea in a quick note",
      published_at: "2025-02-01T00:00:00.000Z",
    },
    {
      id: "post-1",
      type: "post",
      title: "Search architecture",
      content: "Detailed implementation notes",
      published_at: "2024-01-01T00:00:00.000Z",
    },
    {
      id: "event-1",
      type: "event",
      title: "Weekly recap",
      content: "Search planning session",
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
