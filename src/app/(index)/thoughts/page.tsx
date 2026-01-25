import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CollectionBody from "../components/CollectionBody";
import { cn } from "@/lib/utils";
import { QueryData } from "@supabase/supabase-js";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Thoughts",
};

export default async function ThoughtsPage() {
  const thoughtsQuery = supabase
    .from("thoughts")
    .select("id, content, images, created_at")
    .order("created_at", { ascending: false });
  type ThoughtListItem = QueryData<typeof thoughtsQuery>[number];
  const { data: thoughts } = await thoughtsQuery;

  const safeThoughts: ThoughtListItem[] = (thoughts || []).map((t) => ({
    ...t,
    images: t.images || [],
  }));

  const totalThoughts = safeThoughts.length;
  const totalCharacters = safeThoughts.reduce(
    (acc, t) => acc + t.content.length,
    0,
  );

  // Format date detail
  const formatDateDetail = (dateStr: string | null) => {
    if (!dateStr) return "Unknown Date";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <CollectionBody
      title="Thoughts"
      description={
        <>
          A corner for my random thoughts and life fragments. Total{" "}
          <span className="text-zinc-900 dark:text-zinc-100 font-bold">
            {totalThoughts}
          </span>{" "}
          entries, approx{" "}
          <span className="text-zinc-900 dark:text-zinc-100 font-bold">
            {totalCharacters}
          </span>{" "}
          characters.
        </>
      }
    >
      <div className="space-y-12 mt-4 pt-1 border-l border-zinc-200 dark:border-zinc-800 pl-6">
        {safeThoughts.map((thought, index) => (
          <div key={thought.id} className="group">
            {/* Meta Row */}
            <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500 font-mono mb-3">
              <span className="font-bold text-zinc-500 dark:text-zinc-400">
                #{totalThoughts - index}
              </span>
              <span>•</span>
              <span>{formatDateDetail(thought.created_at)}</span>
            </div>

            {/* Content */}
            <div className="prose prose-zinc dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-200 text-base leading-relaxed mb-4">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {thought.content}
              </ReactMarkdown>
            </div>

            {/* Images Grid */}
            {thought.images && thought.images.length > 0 && (
              <div
                className={`grid gap-2 mt-4 ${
                  thought.images.length === 1
                    ? "grid-cols-1 max-w-md"
                    : "grid-cols-2 md:grid-cols-3"
                }`}
              >
                {thought.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 aspect-[4/3]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`Thought image ${idx + 1}`}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Divider */}
            <div
              className={cn(
                "h-px bg-zinc-100 dark:bg-zinc-800/60 w-full mt-12",
                index === safeThoughts.length - 1 && "hidden",
              )}
            ></div>
          </div>
        ))}
      </div>
    </CollectionBody>
  );
}
