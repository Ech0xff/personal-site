import { Tables, TablesInsert, TablesUpdate } from "./supabase";

export type Post = Tables<'posts'>;
export type Thought = Tables<'thoughts'>;
export type Event = Tables<'events'>;

export type PostInsert = TablesInsert<'posts'>;
export type PostUpdate = TablesUpdate<'posts'>;

export type ThoughtInsert = TablesInsert<'thoughts'>;
export type ThoughtUpdate = TablesUpdate<'thoughts'>;

export type EventInsert = TablesInsert<'events'>;
export type EventUpdate = TablesUpdate<'events'>;