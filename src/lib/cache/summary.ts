import { unstable_cache } from "next/cache";

import { createClient } from "@/lib/supabase/client";
import { BlogSummaryData, Status } from "@/types";

import { CACHE_TAGS, CACHE_TIMES } from "./index";

export const getCachedSummary = unstable_cache(
  async (
    recentLimit: number = 5,
    queryStatus?: Status,
  ): Promise<BlogSummaryData | null> => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_summary", {
      recent_limit: recentLimit,
      query_status: queryStatus,
    });

    if (error) {
      console.error("Error fetching summary:", error);
      return null;
    }

    return data as BlogSummaryData | null;
  },
  ["summary"],
  {
    tags: [CACHE_TAGS.SUMMARY],
    revalidate: CACHE_TIMES.SUMMARY,
  },
);
