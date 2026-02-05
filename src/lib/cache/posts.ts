import { unstable_cache } from "next/cache";

import { createClient } from "@/lib/supabase/client";

import { CACHE_TAGS, CACHE_TIMES } from "./index";

export const getCachedPosts = unstable_cache(
  async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    return data || [];
  },
  ["posts-list"],
  { tags: [CACHE_TAGS.POSTS], revalidate: CACHE_TIMES.POSTS_LIST },
);

export const getCachedPost = unstable_cache(
  async (id: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();
    return data;
  },
  ["post-detail"],
  {
    tags: [CACHE_TAGS.POSTS],
    revalidate: CACHE_TIMES.POST_DETAIL,
  },
);
