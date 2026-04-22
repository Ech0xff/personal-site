export type { SearchRpcRow } from "@/lib/shared/services/rpcs";

import type { SearchRpcRow } from "@/lib/shared/services/rpcs";

import { fetchSearchContentByBrowser } from "./rpcs";
import {
  normalizeSearchQuery,
  type SearchResult,
  sortSearchResults,
} from "./search-utils";

const SEARCH_SANITIZE_REGEX = /[%*_,]/g;

const buildSearchQuery = (query: string) => {
  const normalizedQuery = normalizeSearchQuery(query)
    .replace(SEARCH_SANITIZE_REGEX, " ")
    .trim();

  if (!normalizedQuery) return null;

  return normalizedQuery;
};

const buildSearchHref = (row: SearchRpcRow) => {
  switch (row.type) {
    case "post":
      return `/posts/${row.id}`;
    case "thought":
      return `/thoughts#${row.id}`;
    case "event":
      return `/events#${row.id}`;
  }
};

export const normalizeSearchRows = (
  rows: SearchRpcRow[],
  query: string,
): SearchResult[] =>
  sortSearchResults(
    rows.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.type === "thought" ? "" : row.title || "",
      snippet: row.snippet,
      href: buildSearchHref(row),
      publishedAt: row.published_at,
    })),
    query,
  );

export const searchContentByBrowser = async (query: string) => {
  const searchQuery = buildSearchQuery(query);
  if (!searchQuery) return [];

  const rows = await fetchSearchContentByBrowser(searchQuery);
  return normalizeSearchRows(rows, searchQuery);
};
