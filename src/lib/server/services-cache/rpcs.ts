import { unstable_cache } from "next/cache";

import { fetchSummary } from "@/lib/shared/services";
import { makeStaticClient } from "@/lib/shared/supabase";

import { CACHE_TAGS, CACHE_TIMES } from "./index";

export const fetchCachedSummary = unstable_cache(
  async (recentLimit: number = 5) => {
    const client = makeStaticClient();
    return fetchSummary(client, recentLimit);
  },
  ["summary"],
  {
    tags: [CACHE_TAGS.SUMMARY],
    revalidate: CACHE_TIMES.SUMMARY,
  },
);
