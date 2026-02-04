import { Metadata } from "next";

import { QueryData } from "@supabase/supabase-js";

import ThoughtTimeline from "@/components/ThoughtTimeline";
import { createClient } from "@/lib/supabase/server";

import CollectionBody from "../components/CollectionBody";

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Thoughts",
};

export default async function ThoughtsPage() {
  const supabase = await createClient();
  const thoughtsQuery = supabase
    .from("thoughts")
    .select("id, content, images, created_at")
    .eq("status", "show")
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

  return (
    <CollectionBody
      title="Thoughts"
      description={
        <>
          A corner for my random thoughts and life fragments. Total{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {totalThoughts}
          </span>{" "}
          entries, approx{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {totalCharacters}
          </span>{" "}
          characters.
        </>
      }
    >
      <ThoughtTimeline thoughts={safeThoughts} totalCount={totalThoughts} />
    </CollectionBody>
  );
}
