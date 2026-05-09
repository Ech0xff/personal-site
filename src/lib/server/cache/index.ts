export const CACHE_TAGS = {
  config: "blog:config",
  summary: "blog:summary",
  posts: "blog:posts",
  thoughts: "blog:thoughts",
  events: "blog:events",
  post: (id: string) => `blog:posts:${id}`,
} as const;

export const TABLE_CACHE_TAGS: Record<string, readonly string[]> = {
  configs: [CACHE_TAGS.config],
  event_tags: [CACHE_TAGS.events, CACHE_TAGS.summary],
  events: [CACHE_TAGS.events, CACHE_TAGS.summary],
  post_tags: [CACHE_TAGS.posts, CACHE_TAGS.summary],
  posts: [CACHE_TAGS.posts, CACHE_TAGS.summary],
  thoughts: [CACHE_TAGS.thoughts, CACHE_TAGS.summary],
};
