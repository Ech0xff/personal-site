import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "@/types";

export const fetchEvents = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });
  if (error) throw error;
  return (data || []).map((e) => ({ ...e, tags: e.tags || [] }));
};
