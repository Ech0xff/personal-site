import * as stylex from "@stylexjs/stylex";
import { Suspense } from "react";

import DocumentView from "#components/ui/blocknote/document-view.component";
import { ThoughtsFeed } from "#components/ui/content/thoughts-feed.component";
import { renderCachedDocument } from "#lib/server/content/document-cache.service";
import { listPublicContent } from "#lib/server/content/public-content.service";
import type {
  ContentKind,
  ContentSummary,
} from "#lib/shared/content/content.schema";

import { ContentShell } from "./content-shell.component";
import { contentStyles as styles } from "./public-content.style";
import { RouteReady, RoutePending } from "./route-ready.component";

async function PublicContentData({
  kind,
  title,
}: Readonly<{ kind: Exclude<ContentKind, "posts">; title: string }>) {
  const items = await listPublicContent(kind);
  const documents = new Map(
    await Promise.all(
      items.map(
        async (item) =>
          [
            item.id,
            item.document ? await renderCachedDocument(item.document) : "",
          ] as const,
      ),
    ),
  );
  const body = (item: ContentSummary) => (
    <div {...stylex.props(styles.body)}>
      <DocumentView html={documents.get(item.id) ?? ""} />
    </div>
  );
  const total = <strong {...stylex.props(styles.total)}>{items.length}</strong>;
  const characters = items.reduce((sum, item) => sum + item.characterCount, 0);
  return (
    <RouteReady href={`/${kind}`}>
      <ContentShell>
        <h1 tabIndex={-1} {...stylex.props(styles.title)}>
          {title}
        </h1>
        <p {...stylex.props(styles.description)}>
          Just some random ramblings. Total {total} entries, approx{" "}
          <strong {...stylex.props(styles.total)}>{characters}</strong>{" "}
          characters.
        </p>
        {items.length === 0 ? (
          <p {...stylex.props(styles.description)}>
            Nothing here yet. Check back soon.
          </p>
        ) : (
          <ThoughtsFeed items={items} body={body} />
        )}
      </ContentShell>
    </RouteReady>
  );
}

export function PublicContentPage({
  kind,
  title,
}: Readonly<{ kind: Exclude<ContentKind, "posts">; title: string }>) {
  return (
    <Suspense fallback={<RoutePending />}>
      <PublicContentData kind={kind} title={title} />
    </Suspense>
  );
}
