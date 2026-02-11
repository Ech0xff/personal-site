import { makeBrowserClient } from "@/lib/client/supabase";
import { BlogSummaryData, Event, Post, Thought } from "@/types";

const BUCKET_NAME = "images";

export interface ImageFile {
  id: string;
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

export async function getDashboardSummaryClient(
  recentLimit: number = 5,
): Promise<BlogSummaryData | null> {
  const supabase = makeBrowserClient();
  const { data, error } = await supabase.rpc("get_summary", {
    recent_limit: recentLimit,
  });

  if (error) {
    throw error;
  }

  return data as BlogSummaryData | null;
}

export async function getDashboardPostsClient(): Promise<Post[]> {
  const supabase = makeBrowserClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getDashboardThoughtsClient(): Promise<Thought[]> {
  const supabase = makeBrowserClient();
  const { data, error } = await supabase
    .from("thoughts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map((thought) => ({
    ...thought,
    images: thought.images || [],
  }));
}

export async function getDashboardEventsClient(): Promise<Event[]> {
  const supabase = makeBrowserClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map((event) => ({
    ...event,
    tags: event.tags || [],
  }));
}

export async function getImagesClient(): Promise<{
  success: boolean;
  images?: ImageFile[];
  error?: string;
}> {
  try {
    const supabase = makeBrowserClient();

    const { data, error } = await supabase.storage.from(BUCKET_NAME).list("", {
      limit: 1000,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      return { success: false, error: error.message };
    }

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

export async function deleteImageClient(
  fileName: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = makeBrowserClient();

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete image",
    };
  }
}
