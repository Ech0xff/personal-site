"use client";

import { type ReactNode, useCallback } from "react";

import TagsList from "#components/features/posts/tags-list.component";
import Link from "#components/shared/link.component";
import { useModal } from "#components/ui/modal-provider.component";
import Stack from "#components/ui/stack.component";
import { updatePostStatusByBrowser } from "#lib/client/services";
import { cn } from "#lib/shared/utils";
import { formatTime } from "#lib/shared/utils/date.helper";

import OpenEditorButton from "../_components/editor/open-editor-button.component";
import DashboardShell from "../_components/layout/dashboard-shell.component";
import StatusToggle from "../_components/status/status-toggle.component";
import PostActions from "./_components/post-actions.component";
import PostEditor from "./_components/post-editor";
import { usePosts } from "./_hooks/posts.hook";

const th = (title: string[]) => {
  return (
    <tr className="border-b border-border-default bg-surface-muted dark:bg-surface-card">
      {title.map((item) => (
        <th
          key={item}
          className="px-6 py-3 text-center text-xs font-medium tracking-wider whitespace-nowrap text-text-muted uppercase"
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
  const { posts, error, loading, syncStatus, removePost, refetch } = usePosts();
  const { open, close } = useModal();

  const openEditor = useCallback(
    (id: string | null) => {
      open(
        <PostEditor
          key={id || "new"}
          id={id}
          onClose={() => close()}
          onSaved={async () => {
            await refetch();
            close();
          }}
          className="h-full min-h-0 w-full overflow-hidden"
        />,
      );
    },
    [close, open, refetch],
  );

  return (
    <DashboardShell
      title="Posts"
      optActions={<OpenEditorButton label="New Post" openEditor={openEditor} />}
      loading={loading}
      error={error}
    >
      <Stack y>
        {/* Posts Table */}
        <div className="overflow-hidden rounded-xl border border-border-default bg-surface-card">
          <table className="w-full table-auto">
            <thead>
              {th(["Title", "Tags", "Status", "Published At", "Actions"])}
            </thead>
            <tbody className="divide-y divide-border-default">
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="transition-colors hover:bg-surface-muted"
                >
                  {td(
                    <Link
                      href={`/posts/${post.id}`}
                      className="font-medium text-text-primary transition-colors hover:text-info-text"
                    >
                      {post.title}
                    </Link>,
                    "text-center",
                  )}
                  {td(<TagsList tags={post.tags} maxVisible={3} />)}
                  {td(
                    <StatusToggle
                      status={post.status}
                      onChange={async (nextStatus) => {
                        await updatePostStatusByBrowser(post.id, nextStatus);
                        syncStatus(post.id, nextStatus);
                      }}
                    />,
                  )}
                  {td(
                    formatTime(post.published_at, "MMM D, YYYY"),
                    "text-sm text-text-muted ",
                  )}
                  {td(
                    <PostActions
                      postId={post.id}
                      successCallback={removePost}
                      openEditor={openEditor}
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
  );
}
