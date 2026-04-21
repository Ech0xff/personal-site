import { fetchSummary } from "@/lib/shared/services/rpcs";
import type { TagSourceType } from "@/types";

import { makeBrowserClient } from "../supabase";

type FetchSummaryByBrowserOptions = {
  tagSourceTypes?: TagSourceType[] | null;
};

export const fetchSummaryByBrowser = async (
  options: FetchSummaryByBrowserOptions = {},
) => {
  const client = makeBrowserClient();
  return fetchSummary(client, options);
};
