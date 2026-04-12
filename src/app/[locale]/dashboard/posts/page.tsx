"use client";

import type { ReactNode } from "react";

import TagsList from "@/components/features/posts/TagsList";
import Link from "@/components/ui/Link";
import Stack from "@/components/ui/Stack";
import { cn, formatTime } from "@/lib/shared/utils";

import EditorProvider from "../_components/EditorProvider";
import DashboardShell from "../_components/ui/DashboardShell";
import PostActions from "./_components/PostActions";
import PostEditor, { OpenButton } from "./_components/PostEditor";
import StatusToggle from "./_components/StatusToggle";
import { useHooks } from "./use-hooks";

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
      <Stack x className={cn("items-center justify-center", className)}>
        {children}
      </Stack>
    </td>
  );
};

export default function Page() {
  const { posts, error, loading, syncStatus, removePost, refetch } = useHooks();

  return (
    <EditorProvider editorComponent={PostEditor} onSaved={refetch}>
      <DashboardShell
        title="Posts"
        optActions={<OpenButton />}
        loading={loading}
        error={error}
      >
        <Stack y>
          {/* Posts Table */}
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full table-auto">
              <thead>
                {th(["Title", "Tags", "Status", "Published At", "Actions"])}
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  >
                    {td(
                      <Link
                        href={`/posts/${post.id}`}
                        className="font-medium text-zinc-900 transition-colors hover:text-blue-600 dark:text-zinc-100 dark:hover:text-blue-400"
                      >
                        {post.title}
                      </Link>,
                      "text-center",
                    )}
                    {td(<TagsList tags={post.tags} maxVisible={3} />)}
                    {td(
                      <StatusToggle
                        postId={post.id}
                        status={post.status}
                        successCallback={syncStatus}
                      />,
                    )}
                    {td(
                      formatTime(post.published_at, "MMM D, YYYY"),
                      "text-sm text-zinc-500 dark:text-zinc-400",
                    )}
                    {td(
                      <PostActions
                        postId={post.id}
                        successCallback={removePost}
                      />,
                      "gap-2",
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Stack>
      </DashboardShell>
    </EditorProvider>
  );
}
