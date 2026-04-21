import type { TagWithCount } from "./aggregates";
import type { Tables, TablesInsert, TablesUpdate } from "./supabase";

export * from "./aggregates";
export * from "./supabase";

export type Tag = Tables<"tags">;
export type Post = Tables<"posts">;
export type Thought = Tables<"thoughts">;
export type Event = Tables<"events">;

export type PostInsert = TablesInsert<"posts">;
export type PostUpdate = TablesUpdate<"posts">;

export type ThoughtInsert = TablesInsert<"thoughts">;
export type ThoughtUpdate = TablesUpdate<"thoughts">;

export type EventInsert = TablesInsert<"events">;
export type EventUpdate = TablesUpdate<"events">;

export type Status = "show" | "hide" | string;

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
