import { Suspense, type ReactNode } from "react";
import { z } from "zod";

import DocumentView from "#components/ui/blocknote/document-view.component";
import Loading from "#components/ui/loading.component";
import { requireAdminPage } from "#lib/server/auth/session.service";
import { listContent } from "#lib/server/content/content.service";
import { renderCachedDocument } from "#lib/server/content/document-cache.service";
import type { ContentKind } from "#lib/shared/content/content.schema";

import ContentList from "./content-list.component";

type Props = Readonly<{
  kind: ContentKind;
  searchParams: Promise<{ page?: string }>;
}>;
async function ContentPageData({ kind, searchParams }: Props) {
  await requireAdminPage();
  const page = z.coerce
    .number()
    .int()
    .min(0)
    .max(100000)
    .catch(0)
    .parse((await searchParams).page ?? 0);
  const data = await listContent(kind, page);
  const documents = Object.fromEntries(
    await Promise.all(
      data.items.map(async (item): Promise<readonly [string, ReactNode]> => [
        item.id,
        item.document ? (
          <DocumentView
            key={item.id}
            html={await renderCachedDocument(item.document)}
          />
        ) : null,
      ]),
    ),
  );
  return (
    <ContentList kind={kind} {...data} page={page} documents={documents} />
  );
}

export default function ContentPage(props: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <ContentPageData {...props} />
    </Suspense>
  );
}
