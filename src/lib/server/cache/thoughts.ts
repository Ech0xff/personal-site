import { unstable_cache } from "next/cache";

import { makeStaticClient } from "@/lib/shared/supabase";

import { CACHE_TAGS, CACHE_TIMES } from "./index";

export const getCachedThoughts = unstable_cache(
  async () => {
    const supabase = makeStaticClient();
    const { data } = await supabase
      .from("thoughts")
      .select("*")
      .order("created_at", { ascending: false });
    return (data || []).map((t) => ({ ...t, images: t.images || [] }));
  },
  ["thoughts-list"],
  { tags: [CACHE_TAGS.THOUGHTS], revalidate: CACHE_TIMES.THOUGHTS },
);
