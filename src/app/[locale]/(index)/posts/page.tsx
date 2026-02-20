import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import StackY from "@/components/ui/StackY";
import { fetchCachedPosts } from "@/lib/server/services-cache/posts";
import { formatTime } from "@/lib/shared/utils";

import PostCard from "@/components/features/posts/PostCard";
import CollectionBody from "../components/CollectionBody";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "IndexPosts" });

  return {
    title: t("metaTitle"),
  };
}

export default async function PostsPage() {
  const t = await getTranslations("IndexPosts");
  const tCommon = await getTranslations("Common");
  const posts = await fetchCachedPosts();
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
