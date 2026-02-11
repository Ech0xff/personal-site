"use client";

import { useEffect, useState, type ReactNode } from "react";

import { getDashboardPostsClient } from "@/lib/data/dashboard-client";
import { Post } from "@/types";
import { cn } from "@/lib/utils";

import EditorProvider from "../components/EditorProvider";
import DashboardShell from "../components/ui/DashboardShell";
import NewPostButton from "./components/NewPostButton";
import PostActions from "./components/PostActions";
import PostEditor from "./components/PostEditor";
import StatusToggle from "./components/StatusToggle";

function TagsList({
  tags,
  maxVisible = 3,
}: {
  tags: string[] | null;
  maxVisible?: number;
}) {
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisible);
  const hiddenTags = tags.slice(maxVisible);
  const hasMore = hiddenTags.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visibleTags.map((tag) => (
        <div
          key={tag}
          className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
        >
          {tag}
        </div>
      ))}
      {hasMore && (
        <div className="group/tooltip relative">
          <div className="cursor-default rounded bg-zinc-200 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
            +{hiddenTags.length}
          </div>
          <div className="pointer-events-none invisible absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg bg-zinc-900 px-3 py-2 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-all group-hover/tooltip:visible group-hover/tooltip:opacity-100 dark:bg-zinc-700">
            {hiddenTags.join(", ")}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-700" />
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(dateString: string | null) {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await getDashboardPostsClient();
        if (!isMounted) return;
        setPosts(data);
        setError(false);
      } catch {
        if (!isMounted) return;
        setError(true);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const th = (title: string[]) => {
    return (
      <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        {title.map((item) => (
          <th
            key={item}
            className="px-6 py-3 text-center text-xs font-medium tracking-wider whitespace-nowrap text-zinc-500 uppercase dark:text-zinc-400"
          >
            {item}
          </th>
        ))}
      </tr>
    );
  };

  const td = (children: ReactNode, className?: string) => {
    return (
      <td className="px-6 py-4">
        <div className={cn("flex items-center justify-center", className)}>
          {children}
        </div>
      </td>
    );
  };

  return (
    <EditorProvider editorComponent={PostEditor}>
      <DashboardShell
        title="Posts"
        optActions={<NewPostButton />}
        loading={loading}
        error={error}
      >
        {/* Posts Table */}
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full table-auto">
            <thead>
              {th([
                "Title",
                "Tags",
                "Status",
                "Views",
                "Created At",
                "Actions",
              ])}
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                >
                  {td(
                    post.title,
                    "font-medium text-zinc-900 dark:text-zinc-100",
                  )}
                  {td(<TagsList tags={post.tags} maxVisible={3} />)}
                  {td(<StatusToggle postId={post.id} status={post.status} />)}
                  {td(
                    post.view_count || 0,
                    "text-sm text-zinc-500 dark:text-zinc-400",
                  )}
                  {td(
                    formatDate(post.created_at),
                    "text-sm text-zinc-500 dark:text-zinc-400",
                  )}
                  {td(<PostActions postId={post.id} />, "gap-2")}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardShell>
    </EditorProvider>
  );
}
