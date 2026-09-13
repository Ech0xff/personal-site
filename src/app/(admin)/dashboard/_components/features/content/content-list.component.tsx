"use client";
import * as stylex from "@stylexjs/stylex";
import { Plus, SquarePen, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useTransition, type ReactNode } from "react";
import { toast } from "sonner";

import Button from "#components/ui/button.component";
import Loading from "#components/ui/loading.component";
import { Magnetic } from "#components/ui/magnetic.component";
import { useModal } from "#components/ui/modal-provider.component";
import {
  deleteContent,
  setContentStatus,
} from "#lib/server/content/content.actions";
import type {
  ContentKind,
  ContentSummary,
} from "#lib/shared/content/content.schema";
import { formatTime } from "#lib/shared/utils/date.helper";

import DashboardShell from "../../layout/dashboard-shell.component";
const ContentEditor = dynamic(() => import("./content-editor.component"), {
  ssr: false,
  loading: () => <Loading />,
});
import { listStyles as styles } from "./content-list.style";

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
  const { open, close } = useModal();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const subject =
    kind === "posts" ? "Post" : kind === "thoughts" ? "Thought" : "Event";
  const edit = (id?: string) => {
    open(
      <ContentEditor
        kind={kind}
        id={id}
        onClose={() => close()}
        onSaved={() => {
          close();
          router.refresh();
        }}
      />,
    );
  };
  const mutate = (item: ContentSummary, remove: boolean) => {
    if (
      remove &&
      !confirm(
        `Delete this ${subject.toLowerCase()}? Uploaded files will remain in Files.`,
      )
    )
      return;
    startTransition(async () => {
      try {
        const result = remove
          ? await deleteContent({ kind, id: item.id })
          : await setContentStatus({
              kind,
              id: item.id,
              status: item.status === "show" ? "hide" : "show",
            });
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success(remove ? "Content deleted." : "Visibility updated.");
        router.refresh();
      } catch {
        toast.error("The operation failed. Please try again.");
      }
    });
  };
  const visibility = (item: ContentSummary) => (
    <fieldset
      aria-label={`Visibility of ${item.title || "thought"}`}
      {...stylex.props(styles.segmented)}
    >
      {(["hide", "show"] as const).map((status) => (
        <button
          key={status}
          type="button"
          aria-pressed={item.status === status}
          disabled={pending}
          onClick={() => {
            if (item.status !== status) mutate(item, false);
          }}
          {...stylex.props(
            styles.segment,
            item.status === status && styles.selected,
          )}
        >
          {status === "hide" ? "Hide" : "Show"}
        </button>
      ))}
    </fieldset>
  );
  const actions = (item: ContentSummary) => (
    <div {...stylex.props(styles.actions)}>
      <button
        type="button"
        aria-label="Edit"
        title="Edit"
        onClick={() => edit(item.id)}
        {...stylex.props(styles.iconButton)}
      >
        <Magnetic compact>
          <SquarePen size={18} />
        </Magnetic>
      </button>
      <button
        type="button"
        aria-label="Delete"
        title="Delete"
        disabled={pending}
        onClick={() => mutate(item, true)}
        {...stylex.props(styles.iconButton, styles.deleteButton)}
      >
        <Magnetic compact>
          <Trash2 size={18} />
        </Magnetic>
      </button>
    </div>
  );
  const body = (item: ContentSummary) => (
    <div {...stylex.props(styles.body)}>
      {documents[item.id] ?? <p>{item.excerpt}</p>}
    </div>
  );
  return (
    <DashboardShell
      title={`${subject}s`}
      optActions={
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
          <div {...stylex.props(styles.tableWrap)}>
            <table {...stylex.props(styles.table)}>
              <thead>
                <tr>
                  {["Title", "Status", "Published at", "Actions"].map(
                    (label) => (
                      <th key={label} scope="col" {...stylex.props(styles.th)}>
                        {label}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id}>
                    <td
                      {...stylex.props(
                        styles.td,
                        index === items.length - 1 && styles.lastCell,
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => edit(item.id)}
                        {...stylex.props(styles.postTitle)}
                      >
                        {item.title}
                      </button>
                    </td>
                    <td
                      {...stylex.props(
                        styles.td,
                        index === items.length - 1 && styles.lastCell,
                      )}
                    >
                      {visibility(item)}
                    </td>
                    <td
                      {...stylex.props(
                        styles.td,
                        styles.meta,
                        index === items.length - 1 && styles.lastCell,
                      )}
                    >
                      {formatTime(item.published_at)}
                    </td>
                    <td
                      {...stylex.props(
                        styles.td,
                        index === items.length - 1 && styles.lastCell,
                      )}
                    >
                      {actions(item)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {kind === "thoughts" && (
          <div {...stylex.props(styles.feed)}>
            {items.map((item, index) => (
              <article key={item.id} {...stylex.props(styles.thought)}>
                <header {...stylex.props(styles.entryHeader)}>
                  <time
                    dateTime={item.published_at}
                    {...stylex.props(styles.timestamp)}
                  >
                    #{page * 30 + index + 1}　•　
                    {formatTime(item.published_at, "MM/DD, HH:mm")}
                  </time>
                  <div {...stylex.props(styles.actions)}>
                    {visibility(item)}
                    {actions(item)}
                  </div>
                </header>
                {body(item)}
              </article>
            ))}
          </div>
        )}
        {kind === "events" && items.length > 0 && (
          <div {...stylex.props(styles.timeline)}>
            <div aria-hidden {...stylex.props(styles.axis)} />
            {items.map((item, index) => {
              const year = formatTime(item.published_at, "YYYY");
              const newYear =
                index === 0 ||
                year !== formatTime(items[index - 1].published_at, "YYYY");
              return (
                <Fragment key={item.id}>
                  {newYear && (
                    <h3 {...stylex.props(styles.yearAnchor)}>
                      <Magnetic>
                        <span {...stylex.props(styles.year)}>{year}</span>
                      </Magnetic>
                    </h3>
                  )}
                  <article
                    {...stylex.props(
                      styles.event,
                      index % 2 === 1 && styles.eventRight,
                    )}
                  >
                    <span
                      aria-hidden
                      {...stylex.props(
                        styles.dot,
                        index % 2 === 1 && styles.dotRight,
                      )}
                    >
                      <Magnetic compact>
                        <span
                          {...stylex.props(styles.dotFill)}
                          style={{ backgroundColor: item.color }}
                        />
                      </Magnetic>
                    </span>
                    <div {...stylex.props(styles.eventCard)}>
                      <header {...stylex.props(styles.entryHeader)}>
                        <time
                          dateTime={item.published_at}
                          {...stylex.props(styles.timestamp)}
                        >
                          <Magnetic compact>
                            {formatTime(item.published_at, "MMM D")}
                          </Magnetic>
                        </time>
                        <div {...stylex.props(styles.actions)}>
                          {visibility(item)}
                          {actions(item)}
                        </div>
                      </header>
                      {body(item)}
                    </div>
                  </article>
                </Fragment>
              );
            })}
          </div>
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
