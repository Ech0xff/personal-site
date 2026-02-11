import { SupabaseClient } from "@supabase/supabase-js";

import { Database } from "@/types";

export const fetchThoughts = async (client: SupabaseClient<Database>) => {
  const { data, error } = await client
    .from("thoughts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((t) => ({ ...t, images: t.images || [] }));
};
