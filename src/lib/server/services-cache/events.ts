import { unstable_cache } from "next/cache";

import { fetchEvents } from "@/lib/shared/services";
import { makeStaticClient } from "@/lib/shared/supabase";

import { CACHE_TAGS, CACHE_TIMES } from "./index";

export const fetchCachedEvents = unstable_cache(
  async () => {
    const client = makeStaticClient();
    return fetchEvents(client);
  },
  ["events-list"],
  { tags: [CACHE_TAGS.EVENTS], revalidate: CACHE_TIMES.EVENTS },
);
