import * as stylex from "@stylexjs/stylex";
import { Suspense } from "react";

import DocumentView from "#components/ui/blocknote/document-view.component";
import { EventsTimeline } from "#components/ui/content/events-timeline.component";
import { ThoughtsFeed } from "#components/ui/content/thoughts-feed.component";
import { renderCachedDocument } from "#lib/server/content/document-cache.service";
import { listPublicContent } from "#lib/server/content/public-content.service";
import type {
  ContentKind,
  ContentSummary,
} from "#lib/shared/content/content.schema";

import { contentStyles as styles } from "./public-content.style";

async function PublicDocument({ item }: Readonly<{ item: ContentSummary }>) {
  if (!item.document) return null;
  return <DocumentView html={await renderCachedDocument(item.document)} />;
}
async function PublicContentData({
  kind,
}: Readonly<{ kind: Exclude<ContentKind, "posts"> }>) {
  const items = await listPublicContent(kind).catch(() => null);
  if (items === null)
    return (
      <output>Content is unavailable right now. Please try again later.</output>
    );
  const body = (item: ContentSummary) => (
    <div {...stylex.props(styles.body)}>
      <PublicDocument item={item} />
    </div>
  );
  const total = <strong {...stylex.props(styles.total)}>{items.length}</strong>;
  const characters = items.reduce((sum, item) => sum + item.characterCount, 0);
  return (
    <>
      <p {...stylex.props(styles.description)}>
        {kind === "thoughts" ? (
          <>
            Just some random ramblings. Total {total} entries, approx{" "}
            <strong {...stylex.props(styles.total)}>{characters}</strong>{" "}
            characters.
          </>
        ) : (
          <>
            A timeline of memorable moments and milestones. Total {total} events
            recorded, documenting the journey.
          </>
        )}
      </p>
      {items.length === 0 ? (
        <p {...stylex.props(styles.description)}>
          Nothing here yet. Check back soon.
        </p>
      ) : kind === "thoughts" ? (
        <ThoughtsFeed items={items} body={body} />
      ) : (
        <EventsTimeline items={items} body={body} />
      )}
    </>
  );
}

export function PublicContentPage({
  kind,
  title,
}: Readonly<{ kind: Exclude<ContentKind, "posts">; title: string }>) {
  return (
    <section {...stylex.props(styles.page)}>
      <h1 tabIndex={-1} {...stylex.props(styles.title)}>
        {title}
      </h1>
      <Suspense fallback={<output>Loading {kind}…</output>}>
        <PublicContentData kind={kind} />
      </Suspense>
    </section>
  );
}
