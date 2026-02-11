import { unstable_cache } from "next/cache";

import { fetchThoughts } from "@/lib/shared/services";
import { makeStaticClient } from "@/lib/shared/supabase";

import { CACHE_TAGS, CACHE_TIMES } from "./index";

export const fetchCachedThoughts = unstable_cache(
  async () => {
    const client = makeStaticClient();
    return fetchThoughts(client);
  },
  ["thoughts-list"],
  { tags: [CACHE_TAGS.THOUGHTS], revalidate: CACHE_TIMES.THOUGHTS },
);
