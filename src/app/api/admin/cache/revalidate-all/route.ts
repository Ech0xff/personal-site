import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { CACHE_TAGS } from "@/lib/server/cache";
import { makeServerClient } from "@/lib/server/supabase";
import { fetchPosts } from "@/lib/shared/services";
import { getUserStatus } from "@/lib/shared/utils/tools";

export async function POST() {
  const client = await makeServerClient();
  const { isAuth, isAdmin } = await getUserStatus(client);

  if (!isAuth || !isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await fetchPosts(client);
    const tags = new Set<string>([
      CACHE_TAGS.summary,
      CACHE_TAGS.posts,
      CACHE_TAGS.thoughts,
      CACHE_TAGS.events,
    ]);

    posts.forEach((post) => {
      tags.add(CACHE_TAGS.post(post.id));
    });

    tags.forEach((tag) => {
      revalidateTag(tag, "max");
    });

    return NextResponse.json({
      message: "All caches revalidated",
      tags: Array.from(tags),
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to revalidate caches" },
      { status: 500 },
    );
  }
}
