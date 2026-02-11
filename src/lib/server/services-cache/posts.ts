import { unstable_cache } from "next/cache";

import { fetchPost, fetchPosts } from "@/lib/shared/services";
import { makeStaticClient } from "@/lib/shared/supabase";

import { CACHE_TAGS, CACHE_TIMES } from "./index";

export const fetchCachedPosts = unstable_cache(
  async () => {
    const client = makeStaticClient();
    return fetchPosts(client);
  },
  ["posts-list"],
  { tags: [CACHE_TAGS.POSTS], revalidate: CACHE_TIMES.POSTS_LIST },
);

export const fetchCachedPost = unstable_cache(
  async (id: string) => {
    const client = makeStaticClient();
    return fetchPost(client, id);
  },
  ["post-detail"],
  {
    tags: [CACHE_TAGS.POSTS],
    revalidate: CACHE_TIMES.POST_DETAIL,
  },
);
