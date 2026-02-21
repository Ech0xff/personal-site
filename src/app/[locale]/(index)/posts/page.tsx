"use cache";

import { Metadata } from "next";

import PostCard from "@/components/features/posts/PostCard";
import StackY from "@/components/ui/StackY";
import { getI18n } from "@/i18n/tools";
import { fetchPosts } from "@/lib/shared/services";
import { makeStaticClient } from "@/lib/shared/supabase";
import { formatTime } from "@/lib/shared/utils";

import CollectionBody from "../components/CollectionBody";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getI18n("IndexPosts", locale);

  return {
    title: t("metaTitle"),
  };
}

export default async function PostsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getI18n("IndexPosts", locale);
  const tCommon = await getI18n("Common", locale);
  const client = makeStaticClient();
  const posts = await fetchPosts(client);
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
      title={t("title")}
      description={t.rich("description", {
        totalPosts,
        totalCharacters,
        b: (chunks) => (
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {chunks}
          </span>
        ),
      })}
    >
      <div className="space-y-12">
        {sortedYears.map((year) => (
          <section key={year}>
            {/* Year Title */}
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
              {year === "Unknown" ? tCommon("unknownYear") : year}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({groupedPosts[year]?.length})
              </span>
            </h2>

            {/* List of posts for the year */}
            <StackY className="gap-1">
              {groupedPosts[year]?.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </StackY>
          </section>
        ))}
      </div>
    </CollectionBody>
  );
}
