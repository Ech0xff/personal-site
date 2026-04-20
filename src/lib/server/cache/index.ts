export const CACHE_TAGS = {
  config: "blog:config",
  summary: "blog:summary",
  posts: "blog:posts",
  thoughts: "blog:thoughts",
  events: "blog:events",
  post: (id: string) => `blog:posts:${id}`,
} as const;

type CacheTable = "posts" | "thoughts" | "events";

export const getCollectionTagByTable = (table: CacheTable) => {
  switch (table) {
    case "posts":
      return CACHE_TAGS.posts;
    case "thoughts":
      return CACHE_TAGS.thoughts;
    case "events":
      return CACHE_TAGS.events;
  }
};
