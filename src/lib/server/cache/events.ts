import { unstable_cache } from "next/cache";

import { makeStaticClient } from "@/lib/shared/supabase";

import { CACHE_TAGS, CACHE_TIMES } from "./index";

export const getCachedEvents = unstable_cache(
  async () => {
    const supabase = makeStaticClient();
    const { data } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });
    return (data || []).map((e) => ({ ...e, tags: e.tags || [] }));
  },
  ["events-list"],
  { tags: [CACHE_TAGS.EVENTS], revalidate: CACHE_TIMES.EVENTS },
);
