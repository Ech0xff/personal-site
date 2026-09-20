import type { ContentKind } from "#lib/shared/content/content.schema";
export const contentLabels = {
  posts: { singular: "Post", plural: "Posts" },
  thoughts: { singular: "Thought", plural: "Thoughts" },
} as const satisfies Record<ContentKind, { singular: string; plural: string }>;
