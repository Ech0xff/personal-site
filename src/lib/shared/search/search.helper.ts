import type { SearchRpcRow } from "#lib/shared/services/rpcs.service";
import { toPreviewText } from "#lib/shared/utils";

import type {
  SearchResult,
  SearchHighlightSegment,
  SearchContentOptions,
} from "./search.type";

const WHITESPACE_REGEX = /\s+/g;
const REGEX_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/g;

export const normalizeSearchQuery = (value: string) =>
  value.trim().replace(WHITESPACE_REGEX, " ");

const escapeForRegex = (value: string) =>
  value.replace(REGEX_SPECIAL_CHARACTERS, "\\$&");

const trimSnippetEdge = (value: string) =>
  value.replace(/^[\s.,;:!?-]+|[\s.,;:!?-]+$/g, "");
const trimPartialLeadingWord = (value: string) => value.replace(/^\S*\s+/, "");
const trimPartialTrailingWord = (value: string) => value.replace(/\s+\S*$/, "");

export const createSearchSnippet = (
  value: string,
  query: string,
  maxLength = 120,
) => {
  const plainText = toPreviewText(value);
  if (!plainText) return "";

  if (plainText.length <= maxLength) return plainText;

  const normalizedQuery = normalizeSearchQuery(query).toLowerCase();
  const loweredText = plainText.toLowerCase();
  const directMatchIndex = normalizedQuery
    ? loweredText.indexOf(normalizedQuery)
    : -1;
  const fallbackTerm = normalizedQuery.split(" ")[0] || "";
  const matchIndex =
    directMatchIndex >= 0
      ? directMatchIndex
      : fallbackTerm
        ? loweredText.indexOf(fallbackTerm)
        : -1;

  if (matchIndex < 0) {
    return `${trimSnippetEdge(plainText.slice(0, maxLength))}...`;
  }

  const centeredStart = Math.max(0, matchIndex - Math.floor(maxLength / 3));
  const end = Math.min(plainText.length, centeredStart + maxLength);
  let slice = plainText.slice(centeredStart, end);
  if (centeredStart > 0) {
    slice = trimPartialLeadingWord(slice);
  }
  if (end < plainText.length) {
    slice = trimPartialTrailingWord(slice);
  }
  slice = trimSnippetEdge(slice);
  const prefix = centeredStart > 0 ? "..." : "";
  const suffix = end < plainText.length ? "..." : "";

  return `${prefix}${slice}${suffix}`;
};

export const getSearchHighlightSegments = (
  value: string,
  query: string,
): SearchHighlightSegment[] => {
  if (!value) return [];

  const terms = Array.from(
    new Set(
      normalizeSearchQuery(query)
        .split(" ")
        .map((term) => term.trim())
        .filter(Boolean)
        .sort((left, right) => right.length - left.length),
    ),
  );

  if (terms.length === 0) {
    return [{ text: value, matched: false, start: 0 }];
  }

  const matcher = new RegExp(`(${terms.map(escapeForRegex).join("|")})`, "gi");
  const segments = value.split(matcher).filter(Boolean);
  const normalizedTerms = new Set(terms.map((term) => term.toLowerCase()));

  let offset = 0;
  return segments.map((text) => {
    const start = offset;
    offset += text.length;
    return { text, matched: normalizedTerms.has(text.toLowerCase()), start };
  });
};

const getMatchScore = (value: string, query: string) => {
  const normalizedValue = normalizeSearchQuery(value).toLowerCase();
  const normalizedQuery = normalizeSearchQuery(query).toLowerCase();
  if (!normalizedValue || !normalizedQuery) return 0;
  if (normalizedValue.startsWith(normalizedQuery)) return 4;
  if (normalizedValue.includes(normalizedQuery)) return 3;

  const firstTerm = normalizedQuery.split(" ")[0] || "";
  if (!firstTerm) return 0;
  if (normalizedValue.startsWith(firstTerm)) return 2;
  if (normalizedValue.includes(firstTerm)) return 1;
  return 0;
};

export const sortSearchResults = (results: SearchResult[], query: string) =>
  [...results].sort((left, right) => {
    const leftScore =
      getMatchScore(left.title, query) * 10 +
      getMatchScore(left.snippet, query);
    const rightScore =
      getMatchScore(right.title, query) * 10 +
      getMatchScore(right.snippet, query);

    if (leftScore !== rightScore) return rightScore - leftScore;

    return (
      new Date(right.publishedAt).getTime() -
      new Date(left.publishedAt).getTime()
    );
  });

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
