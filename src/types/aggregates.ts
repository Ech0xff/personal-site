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

export type RecentActivityItem =
  | {
      id: string;
      kind: "post";
      published_at: string;
      tags: Tag[];
      title: string;
    }
  | {
      id: string;
      kind: "event";
      published_at: string;
      tags: Tag[];
      title: string;
    }
  | {
      id: string;
      kind: "thought";
      published_at: string;
      tags: [];
      title: string;
    };

export type TagWithCount = Tag & {
  count: number;
};

export type TagSourceType = "post" | "thought" | "event";
