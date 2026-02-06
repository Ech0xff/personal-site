import { unstable_cache } from "next/cache";

import { makeStaticClient } from "@/lib/supabase";
import { BlogSummaryData } from "@/types";

import { CACHE_TAGS, CACHE_TIMES } from "./index";

export const getCachedSummary = unstable_cache(
  async (recentLimit: number = 5): Promise<BlogSummaryData | null> => {
    const supabase = makeStaticClient();
    const { data, error } = await supabase.rpc("get_summary", {
      recent_limit: recentLimit,
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
