import Link from "next/link";

import { QueryData } from "@supabase/supabase-js";
import { Edit, Plus, Trash2 } from "lucide-react";

import ThoughtTimeline, { ThoughtItem } from "@/components/ThoughtTimeline";
import { supabase } from "@/lib/supabase";

import HeaderSection from "../components/HeaderSection";
import { deleteThought } from "./actions";

const thoughtsQuery = supabase
  .from("thoughts")
  .select("id, content, images, created_at");
type Thought = QueryData<typeof thoughtsQuery>[number];

function ThoughtActions({ thought }: { thought: ThoughtItem }) {
  const deleteWithId = deleteThought.bind(null, thought.id);

  return (
    <>
      <Link
        href={`/dashboard/thoughts/${thought.id}`}
        className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Link>
      <form action={deleteWithId} className="inline">
        <button
          type="submit"
          className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </form>
    </>
  );
}

export default async function ThoughtsPage() {
  const { data: thoughts, error } = await thoughtsQuery.order("created_at", {
    ascending: false,
  });

  if (error) {
    console.error("Error fetching thoughts:", error);
  }

  const safeThoughts: Thought[] = (thoughts || []).map((t) => ({
    ...t,
    images: t.images || [],
  }));

  return (
    <div className="space-y-6">
      <HeaderSection title="Thoughts">
        <Link
          href="/dashboard/thoughts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Thought
        </Link>
      </HeaderSection>

      <ThoughtTimeline
        thoughts={safeThoughts}
        renderActions={(thought) => <ThoughtActions thought={thought} />}
      />
    </div>
  );
}
