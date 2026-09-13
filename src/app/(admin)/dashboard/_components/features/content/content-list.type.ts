import type { ReactNode } from "react";

import type { ContentSummary } from "#lib/shared/content/content.schema";
export type ContentListViewProps = Readonly<{
  items: readonly ContentSummary[];
  page: number;
  visibility: (item: ContentSummary) => ReactNode;
  actions: (item: ContentSummary) => ReactNode;
  body: (item: ContentSummary) => ReactNode;
}>;
