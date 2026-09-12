import type { Status } from "#lib/shared/content/status.schema";

import type { TagWithCount } from "./aggregates.type";
import type { Tables, TablesInsert, TablesUpdate } from "./supabase";

export * from "./aggregates.type";
export * from "./supabase";
export type { Status } from "#lib/shared/content/status.schema";

export type Tag = Tables<"tags">;
export type Post = Omit<Tables<"posts">, "status"> & { status: Status };
export type Thought = Omit<Tables<"thoughts">, "status"> & { status: Status };
export type Event = Omit<Tables<"events">, "status"> & { status: Status };

export type PostInsert = Omit<TablesInsert<"posts">, "status"> & {
  status?: Status;
};
export type PostUpdate = Omit<TablesUpdate<"posts">, "status"> & {
  status?: Status;
};

export type ThoughtInsert = Omit<TablesInsert<"thoughts">, "status"> & {
  status?: Status;
};
export type ThoughtUpdate = Omit<TablesUpdate<"thoughts">, "status"> & {
  status?: Status;
};

export type EventInsert = Omit<TablesInsert<"events">, "status"> & {
  status?: Status;
};
export type EventUpdate = Omit<TablesUpdate<"events">, "status"> & {
  status?: Status;
};

export interface ContributionDay {
  date: string;
  count: number;
}

interface SummaryItem {
  count: number;
  characters: number;
  contributions: ContributionDay[];
}

export interface BlogSummaryData {
  posts: SummaryItem;
  thoughts: SummaryItem;
  events: SummaryItem;
  tags: TagWithCount[];
}

export type ImageFile = {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
};
