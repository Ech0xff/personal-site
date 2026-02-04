import { BlogSummaryData, Status } from "@/types";

import { createClient } from "./supabase/server";

export async function getSummary(
  recentLimit: number = 5,
  queryStatus?: Status,
): Promise<BlogSummaryData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_summary", {
    recent_limit: recentLimit,
    query_status: queryStatus,
  });

  if (error) {
    console.error("Error fetching summary:", error);
    return null;
  }

  return data as BlogSummaryData | null;
}
