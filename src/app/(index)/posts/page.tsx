import { Metadata } from "next";
import Link from "next/link";

import { QueryData } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

import CollectionBody from "../components/CollectionBody";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Posts",
};

export default async function PostsPage() {
  const postsQuery = supabase
    .from("posts")
    .select("id, title, published_at, created_at, content")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  type PostListItem = QueryData<typeof postsQuery>[number];
  const { data: posts } = await postsQuery;

  const safePosts: PostListItem[] = posts || [];
  const totalPosts = safePosts.length;
  const totalCharacters = safePosts.reduce(
    (acc, p) => acc + p.content.length,
    0,
  );

  const groupedPosts: Record<string, PostListItem[]> = {};

  safePosts.forEach((post) => {
    const dateStr = post.published_at || post.created_at || "";
    const date = new Date(dateStr);
    const year = date.getFullYear().toString();

    if (!groupedPosts[year]) {
      groupedPosts[year] = [];
    }
    groupedPosts[year].push(post);
  });

  // Sort years descending
  const sortedYears = Object.keys(groupedPosts).sort(
    (a, b) => Number(b) - Number(a),
  );

  // Format date as Month Day, Year
  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return "Unknown Date";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="group flex items-center rounded-r-lg border-l-2 border-gray-200 py-2 pl-6 hover:border-blue-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-zinc-900/50"
                >
                  {/* Title */}
                  <span className="mx-4 flex-1">{post.title}</span>
                  {/* Date */}
                  <span className="w-28 shrink-0 text-sm text-gray-400">
                    {formatDate(post.published_at || post.created_at)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </CollectionBody>
  );
}
