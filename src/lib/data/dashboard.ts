import { ImageFile } from "@/actions";
import { makeServerClient } from "@/lib/supabase";
import { BlogSummaryData } from "@/types";

const BUCKET_NAME = "images";

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

/** Get all images from storage bucket */
export async function getImages(): Promise<{
  success: boolean;
  images?: ImageFile[];
  error?: string;
}> {
  try {
    const supabase = await makeServerClient();

    const { data, error } = await supabase.storage.from(BUCKET_NAME).list("", {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    // Filter out folders and get public URLs
    const images: ImageFile[] = (data || [])
      .filter((file) => file.name && !file.name.endsWith("/"))
      .map((file) => {
        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);

        return {
          id: file.id,
          name: file.name,
          url: publicUrl,
          size: file.metadata?.size || 0,
          createdAt: file.created_at,
        };
      });

    return { success: true, images };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch images",
    };
  }
}
