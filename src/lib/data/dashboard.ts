import { makeServerClient } from "@/lib/supabase";
import { BlogSummaryData } from "@/types";

export async function getDashboardSummary(
  recentLimit: number = 5,
): Promise<BlogSummaryData | null> {
  const supabase = await makeServerClient();
  const { data, error } = await supabase.rpc("get_summary", {
    recent_limit: recentLimit,
  });

  if (error) {
    console.error("Error fetching summary:", error);
    return null;
  }

  return data as BlogSummaryData | null;
}

export async function getDashboardPosts() {
  const supabase = await makeServerClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return data || [];
}

export async function getDashboardThoughts() {
  const supabase = await makeServerClient();
  const { data, error } = await supabase
    .from("thoughts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching thoughts:", error);
    return [];
  }

  return (data || []).map((t) => ({ ...t, images: t.images || [] }));
}

export async function getDashboardEvents() {
  const supabase = await makeServerClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return (data || []).map((e) => ({ ...e, tags: e.tags || [] }));
}
