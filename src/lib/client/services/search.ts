export type { SearchRpcRow } from "#lib/shared/services/rpcs";

import type { SearchRpcRow } from "#lib/shared/services/rpcs";
import { toPreviewText } from "#lib/shared/utils";

import { fetchSearchContentByBrowser } from "./rpcs";
import {
  normalizeSearchQuery,
  type SearchResult,
  sortSearchResults,
} from "./search-utils";

const SEARCH_SANITIZE_REGEX = /[%*_,]/g;

type SearchContentOptions = {
  searchRawText?: boolean;
};

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

const buildSearchableText = (result: SearchResult) =>
  normalizeSearchQuery(`${result.title} ${result.snippet}`).toLowerCase();

const hasVisibleMatch = (result: SearchResult, query: string) => {
  const normalizedQuery = normalizeSearchQuery(query).toLowerCase();
  if (!normalizedQuery) return true;

  const searchableText = buildSearchableText(result);
  if (searchableText.includes(normalizedQuery)) return true;

  return normalizedQuery
    .split(" ")
    .filter(Boolean)
    .some((term) => searchableText.includes(term));
};

export const normalizeSearchRows = (
  rows: SearchRpcRow[],
  query: string,
  options: SearchContentOptions = {},
): SearchResult[] =>
  sortSearchResults(
    rows
      .map((row) => {
        const rawTitle = row.title || "";
        const rawSnippet = row.snippet;
        const visibleResult = {
          id: row.id,
          type: row.type,
          title: row.type === "thought" ? "" : toPreviewText(rawTitle),
          snippet: toPreviewText(rawSnippet),
          href: buildSearchHref(row),
          publishedAt: row.published_at,
        };

        if (!options.searchRawText) {
          return visibleResult;
        }

        return {
          ...visibleResult,
          rawTitle: row.type === "thought" ? "" : rawTitle,
          rawSnippet,
        };
      })
      .filter(
        (result) => options.searchRawText || hasVisibleMatch(result, query),
      ),
    query,
  );

export const searchContentByBrowser = async (
  query: string,
  options: SearchContentOptions = {},
) => {
  const searchQuery = buildSearchQuery(query);
  if (!searchQuery) return [];

  const rows = await fetchSearchContentByBrowser(searchQuery);
  return normalizeSearchRows(rows, searchQuery, options);
};
