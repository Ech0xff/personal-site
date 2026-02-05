import { unstable_cache } from "next/cache";

import { createClient } from "@/lib/supabase/client";

import { CACHE_TAGS, CACHE_TIMES } from "./index";

export const getCachedThoughts = unstable_cache(
  async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("thoughts")
      .select("id, content, images, created_at")
      .eq("status", "show")
      .order("created_at", { ascending: false });
    return (data || []).map((t) => ({ ...t, images: t.images || [] }));
  },
  ["thoughts-list"],
  { tags: [CACHE_TAGS.THOUGHTS], revalidate: CACHE_TIMES.THOUGHTS },
);
