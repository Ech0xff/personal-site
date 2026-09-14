import type { ContentKind } from "#lib/shared/content/content.schema";

export const contentListTag = (kind: ContentKind): string => `content:${kind}`;
export const publicPostTag = (id: string): string => `content:post:${id}`;
