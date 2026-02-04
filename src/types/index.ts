import { Tables, TablesInsert, TablesUpdate } from "./supabase";

export type Post = Tables<"posts">;
export type Thought = Tables<"thoughts">;
export type Event = Tables<"events">;

export type PostInsert = TablesInsert<"posts">;
export type PostUpdate = TablesUpdate<"posts">;

export type ThoughtInsert = TablesInsert<"thoughts">;
export type ThoughtUpdate = TablesUpdate<"thoughts">;

export type EventInsert = TablesInsert<"events">;
export type EventUpdate = TablesUpdate<"events">;

interface StatsItem {
  show: {
    count: number;
    characters: number;
  };
  hide: {
    count: number;
    characters: number;
  };
}

export type Status = "show" | "hide" | string;

export interface BlogSummaryData {
  statistics: {
    posts: StatsItem;
    thoughts: StatsItem;
    events: StatsItem;
  };
  recently: {
    posts: Post[];
    thoughts: Thought[];
    events: Event[];
  };
}
