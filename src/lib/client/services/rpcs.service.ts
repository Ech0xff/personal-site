import {
  fetchSearchContent,
  fetchSummary,
} from "#lib/shared/services/rpcs.service";
import type { TagSourceType } from "#types";

import { makeBrowserClient } from "../supabase.client";

type FetchSummaryByBrowserOptions = {
  tagSourceTypes?: TagSourceType[] | null;
};

export const fetchSummaryByBrowser = async (
  options: FetchSummaryByBrowserOptions = {},
) => {
  const client = makeBrowserClient();
  return fetchSummary(client, options);
};

export const fetchSearchContentByBrowser = async (searchQuery: string) => {
  const client = makeBrowserClient();
  return fetchSearchContent(searchQuery, client);
};
