import Link from "next/link";
import { Metadata } from "next";
import { supabase } from "@/lib/supabase";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Posts",
};

interface PostListItem {
  id: string;
  title: string;
  published_at?: string;
  created_at: string;
}

export default async function PostsPage() {
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, published_at, created_at")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const safePosts: PostListItem[] = posts || [];
  const totalPosts = safePosts.length;

  const groupedPosts: Record<string, PostListItem[]> = {};

  safePosts.forEach((post) => {
    const dateStr = post.published_at || post.created_at;
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
  const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full pt-10">
      {/* Page Title */}
      <h1 className="text-4xl font-bold mb-4">Posts</h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-12">
        {totalPosts} posts in total, grouped by year.
      </p>

      {/* Posts grouped by year */}
      {sortedYears.length > 0 ? (
        <div className="space-y-12">
          {sortedYears.map((year) => (
            <section key={year}>
              {/* Year Title */}
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-200">
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
                    className="group flex items-center py-2 border-l-2 pl-6 border-gray-200 dark:border-gray-800 hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-zinc-900/50 rounded-r-lg"
                  >
                    {/* Title */}
                    <span className="flex-1 mx-4">
                      {post.title}
                    </span>
                    {/* Date */}
                    <span className="w-28 shrink-0 text-gray-400 text-sm">
                      {formatDate(post.published_at || post.created_at)}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20">
          <p className="text-base text-gray-500 dark:text-gray-400">
            No posts found yet, stay tuned...
          </p>
        </div>
      )}
    </div>
  );
}
