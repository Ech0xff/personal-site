import { Metadata } from "next";

import { fetchCachedPosts } from "@/lib/server/services-cache/posts";
import { formatTime } from "@/lib/shared/utils";

import CollectionBody from "../components/CollectionBody";
import PostListItem from "../components/PostListItem";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Posts",
};

export default async function PostsPage() {
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
      title="Posts"
      description={
        <>
          Writings and articles about tech, life, and everything in between.
          Total{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {totalPosts}
          </span>{" "}
          posts, approx{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {totalCharacters}
          </span>{" "}
          characters.
        </>
      }
    >
      <div className="space-y-12">
        {sortedYears.map((year) => (
          <section key={year}>
            {/* Year Title */}
            <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-gray-800 dark:text-gray-200">
              {year}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                ({groupedPosts[year]?.length})
              </span>
            </h2>

            {/* List of posts for the year */}
            <div className="space-y-1">
              {groupedPosts[year]?.map((post) => (
                <PostListItem
                  key={post.id}
                  id={post.id}
                  title={post.title}
                  publishedAt={post.published_at}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </CollectionBody>
  );
}
