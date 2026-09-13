"use client";

import * as stylex from "@stylexjs/stylex";
import { type ReactNode, useCallback } from "react";

import Link from "#components/shared/link.component";
import { useModal } from "#components/ui/modal-provider.component";
import Stack from "#components/ui/stack.component";
import type { StyleInput } from "#design/style.type";
import { color, font, space, shape, motionToken } from "#design/tokens.stylex";
import { updatePostStatusByBrowser } from "#lib/client/services";
import { formatTime } from "#lib/shared/utils/date.helper";

import OpenEditorButton from "../_components/editor/open-editor-button.component";
import TagsList from "../_components/features/posts/tags-list.component";
import DashboardShell from "../_components/layout/dashboard-shell.component";
import StatusToggle from "../_components/status/status-toggle.component";
import PostActions from "./_components/post-actions.component";
import PostEditor from "./_components/post-editor";
import { usePosts } from "./_hooks/posts.hook";
const styles = stylex.create({
  state: {
    textAlign: "center",
  },
  state2: {
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.muted,
  },
  state3: {
    gap: space.xs,
  },
  row: {
    borderBottomWidth: shape.fine,
    borderBottomStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: {
      default: color.surfaceMuted,
      ':is([data-theme="dark"] *)': color.surface,
    },
  },
  headerCell: {
    paddingLeft: space.lg,
    paddingRight: space.lg,
    paddingTop: space.sm,
    paddingBottom: space.sm,
    textAlign: "center",
    fontSize: font.small,
    lineHeight: 1.5,
    fontWeight: font.medium,
    letterSpacing: ".05em",
    whiteSpace: "nowrap",
    color: color.muted,
    textTransform: "uppercase",
  },
  cell: {
    paddingLeft: space.lg,
    paddingRight: space.lg,
    paddingTop: space.md,
    paddingBottom: space.md,
  },
  row2: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    height: "100%",
    minHeight: "0px",
    width: "100%",
    overflow: "hidden",
  },
  container: {
    overflow: "hidden",
    borderTopLeftRadius: shape.card,
    borderTopRightRadius: shape.card,
    borderBottomRightRadius: shape.card,
    borderBottomLeftRadius: shape.card,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: color.surface,
  },
  table: {
    width: "100%",
    tableLayout: "auto",
  },
  row3: {
    borderBottomWidth: shape.fine,
    borderBottomStyle: "solid",
    borderBottomColor: color.line,
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    backgroundColor: {
      default: null,
      ":hover": color.surfaceMuted,
    },
  },
  link: {
    fontWeight: font.medium,
    color: {
      default: color.text,
      ":hover": color.infoText,
    },
    borderBottomWidth: shape.fine,
    borderBottomStyle: "solid",
    borderBottomColor: color.line,
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
});
const th = (title: string[]) => {
  return (
    <tr {...stylex.props(styles.row)}>
      {title.map((item) => (
        <th key={item} {...stylex.props(styles.headerCell)}>
          {item}
        </th>
      ))}
    </tr>
  );
};
const td = (children: ReactNode, xstyle?: StyleInput) => {
  return (
    <td {...stylex.props(styles.cell)}>
      <Stack x xstyle={[styles.row2, xstyle]}>
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
          xstyle={styles.icon}
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
        <div {...stylex.props(styles.container)}>
          <table {...stylex.props(styles.table)}>
            <thead>
              {th(["Title", "Tags", "Status", "Published At", "Actions"])}
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} {...stylex.props(styles.row3)}>
                  {td(
                    <Link
                      href={`/posts/${post.id}`}
                      {...stylex.props(styles.link)}
                    >
                      {post.title}
                    </Link>,
                    styles.state,
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
                    styles.state2,
                  )}
                  {td(
                    <PostActions
                      postId={post.id}
                      successCallback={removePost}
                      openEditor={openEditor}
                    />,
                    styles.state3,
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
