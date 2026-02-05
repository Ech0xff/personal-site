import { revalidateTag as nextRevalidateTag } from "next/cache";

// Cache Tags Definitions
export const CACHE_TAGS = {
  SUMMARY: "summary",
  POSTS: "posts",
  POST: (id: string) => `post-${id}`,
  THOUGHTS: "thoughts",
  EVENTS: "events",
} as const;

// Cache Times Definitions (in seconds)
export const CACHE_TIMES = {
  SUMMARY: 600,
  POSTS_LIST: 600,
  POST_DETAIL: 600,
  THOUGHTS: 600,
  EVENTS: 600,
} as const;

// Revalidation Configurations
export const REVALIDATE_CONFIG = {
  HOME: 86400,
  LIST: 86400,
  DETAIL: 3600,
} as const;

export function revalidateTag(tag: string) {
  return nextRevalidateTag(tag, {});
}
