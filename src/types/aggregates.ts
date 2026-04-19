import type { Tables } from "./supabase";

type Post = Tables<"posts">;
type Event = Tables<"events">;
type Tag = Tables<"tags">;

export type PostWithTags = Post & {
  tags: Tag[];
};

export type EventWithTags = Event & {
  tags: Tag[];
};

export type TagWithCount = Tag & {
  count: number;
};

export type TagSourceType = "post" | "thought" | "event";
