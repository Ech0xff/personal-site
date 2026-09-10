export type { SearchRpcRow } from "#lib/shared/services/rpcs.service";
import {
  normalizeSearchQuery,
  normalizeSearchRows,
} from "#lib/shared/search/search.helper";
import type { SearchContentOptions } from "#lib/shared/search/search.type";

import { fetchSearchContentByBrowser } from "./rpcs.service";

const SEARCH_SANITIZE_REGEX = /[%*_,]/g;

const buildSearchQuery = (query: string) => {
  const normalizedQuery = normalizeSearchQuery(query)
    .replace(SEARCH_SANITIZE_REGEX, " ")
    .trim();

  if (!normalizedQuery) return null;

  return normalizedQuery;
};

export const searchContentByBrowser = async (
  query: string,
  options: SearchContentOptions = {},
) => {
  const searchQuery = buildSearchQuery(query);
  if (!searchQuery) return [];

  const rows = await fetchSearchContentByBrowser(searchQuery);
  return normalizeSearchRows(rows, searchQuery, options);
};
