"use client";
import * as stylex from "@stylexjs/stylex";
import { Plus } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";

import Button from "#components/ui/button.component";
import { feedStyles } from "#components/ui/content/content-feed.style";
import { EventsTimeline } from "#components/ui/content/events-timeline.component";
import { ThoughtsFeed } from "#components/ui/content/thoughts-feed.component";
import type {
  ContentKind,
  ContentSummary,
} from "#lib/shared/content/content.schema";

import DashboardShell from "../../layout/dashboard-shell.component";
import { ContentActions } from "./content-actions.component";
import { useContentList } from "./content-list.hook";
import { listStyles as styles } from "./content-list.style";
import { contentLabels } from "./content.const";
import { PostsTable } from "./posts-table.component";
import { VisibilityControl } from "./visibility-control.component";

export default function ContentList({
  kind,
  items,
  page,
  hasMore,
  documents,
}: Readonly<{
  kind: ContentKind;
  items: ContentSummary[];
  page: number;
  hasMore: boolean;
  documents: Readonly<Record<string, ReactNode>>;
}>) {
  const { pending, edit, mutate } = useContentList(kind);
  const subject = contentLabels[kind].singular;
  const visibility = (item: ContentSummary) => (
    <VisibilityControl
      value={item.status}
      disabled={pending}
      onChange={() => mutate(item, false)}
      label={`Visibility of ${item.title || subject.toLowerCase()}`}
    />
  );
  const actions = (item: ContentSummary) => (
    <ContentActions
      pending={pending}
      onEdit={() => edit(item.id)}
      onDelete={() => mutate(item, true)}
    />
  );
  const body = (item: ContentSummary) => (
    <div {...stylex.props(feedStyles.body)}>
      {documents[item.id] ?? <p>{item.excerpt}</p>}
    </div>
  );
  return (
    <DashboardShell
      title={`${subject}s`}
      actions={
        <Button onClick={() => edit()}>
          <Plus size={18} aria-hidden />
          New {subject}
        </Button>
      }
    >
      <div {...stylex.props(styles.list)}>
        {items.length === 0 && (
          <p {...stylex.props(styles.meta)}>No content here yet.</p>
        )}
        {kind === "posts" && items.length > 0 && (
          <PostsTable
            onEdit={edit}
            items={items}
            page={page}
            visibility={visibility}
            actions={actions}
            body={body}
          />
        )}
        {kind === "thoughts" && (
          <ThoughtsFeed
            items={items}
            page={page}
            visibility={visibility}
            actions={actions}
            body={body}
          />
        )}
        {kind === "events" && items.length > 0 && (
          <EventsTimeline
            items={items}
            page={page}
            visibility={visibility}
            actions={actions}
            body={body}
          />
        )}
        {(page > 0 || hasMore) && (
          <nav aria-label="Content pages" {...stylex.props(styles.pagination)}>
            {page > 0 && <Link href={`?page=${page - 1}`}>Previous</Link>}
            <span>Page {page + 1}</span>
            {hasMore && <Link href={`?page=${page + 1}`}>Next</Link>}
          </nav>
        )}
      </div>
    </DashboardShell>
  );
}
