import { fetchSummary } from "@/lib/shared/services/rpcs";

import { makeBrowserClient } from "../supabase";

export const fetchSummaryByBrowser = async (recent_limit: number = 5) => {
  const client = makeBrowserClient();
  return fetchSummary(client, recent_limit);
};
