import type { Metadata } from "next";
import { cacheTag } from "next/cache";

import PostCard from "#components/features/posts/PostCard";
import Stack from "#components/ui/Stack";
import { useT } from "#i18n";
import { CACHE_TAGS } from "#lib/server/cache";
import { getScopedT } from "#lib/server/i18n";
import { fetchPosts } from "#lib/shared/services";
import { makeStaticClient } from "#lib/shared/supabase";
import { formatTime } from "#lib/shared/utils";

import CollectionBody from "../_components/CollectionBody";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedT((d) => d.indexPosts);

  return {
    title: t((d) => d.metaTitle),
  };
}

export default async function PostsPage() {
  "use cache";
  cacheTag(CACHE_TAGS.posts);

  const client = makeStaticClient();
  const posts = await fetchPosts(client);

  return <PostsPageContent posts={posts} />;
}

function PostsPageContent({
  posts,
}: {
  posts: Awaited<ReturnType<typeof fetchPosts>>;
}) {
  const translator = useT();
  const t = translator.scope((d) => d.indexPosts);
  const tCommon = translator.scope((d) => d.common);
  const totalPosts = posts.length;
  const totalCharacters = posts.reduce((acc, p) => acc + p.content.length, 0);

  const groupedPosts: Record<string, (typeof posts)[number][]> = {};

  posts.forEach((post) => {
    const year = formatTime(post.published_at, "YYYY", "Unknown");

    if (!groupedPosts[year]) {
      groupedPosts[year] = [];
    }
    groupedPosts[year].push(post);
  });

  // Sort years descending
  const sortedYears = Object.keys(groupedPosts).sort((a, b) => {
    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;
    return Number(b) - Number(a);
  });

  return (
    <CollectionBody
      title={t((d) => d.title)}
      description={t.rich((d) => d.description, {
        totalPosts,
        totalCharacters,
        b: (chunks) => (
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {chunks}
          </span>
        ),
      })}
    >
      <div className="space-y-6">
        {sortedYears.map((year) => (
          <section key={year}>
            {/* Year Title */}
            <h2 className="mb-3 flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
              {year === "Unknown" ? tCommon((d) => d.unknownYear) : year}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({groupedPosts[year]?.length})
              </span>
            </h2>

            {/* List of posts for the year */}
            <Stack y>
              {groupedPosts[year]?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </Stack>
          </section>
        ))}
      </div>
    </CollectionBody>
  );
}
