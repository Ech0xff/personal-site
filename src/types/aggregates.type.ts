import type { Post, Event, Tag } from ".";

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

export type TagWithCount = Pick<Tag, "id" | "name" | "meta"> & {
  count: number;
};

export type TagSourceType = "post" | "thought" | "event";
