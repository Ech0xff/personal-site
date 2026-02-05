import { unstable_cache } from "next/cache";

import { createClient } from "@/lib/supabase/client";

import { CACHE_TAGS, CACHE_TIMES } from "./index";

export const getCachedEvents = unstable_cache(
  async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("events")
      .select("id, title, description, event_date, tags, color, created_at")
      .eq("status", "show")
      .order("event_date", { ascending: false });
    return (data || []).map((e) => ({ ...e, tags: e.tags || [] }));
  },
  ["events-list"],
  { tags: [CACHE_TAGS.EVENTS], revalidate: CACHE_TIMES.EVENTS },
);
