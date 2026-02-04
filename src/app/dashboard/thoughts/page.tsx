import { QueryData } from "@supabase/supabase-js";

import ThoughtTimeline from "@/components/ThoughtTimeline";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

import EditorProvider from "../components/EditorProvider";
import HeaderSection from "../components/HeaderSection";
import NewThoughtButton from "./components/NewThoughtButton";
import ThoughtActions from "./components/ThoughtActions";
import ThoughtEditor from "./components/ThoughtEditor";

function StatusBadge({ status }: { status: string | null }) {
  const styles = {
    show: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    hide: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  };
  const normalizedStatus =
    status === "published"
      ? "show"
      : status === "draft"
        ? "hide"
        : status || "hide";
  const statusKey = normalizedStatus as keyof typeof styles;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        styles[statusKey] || styles.hide,
      )}
    >
      {statusKey === "show" ? "Show" : "Hide"}
    </span>
  );
}

export default async function ThoughtsPage() {
  const supabase = await createClient();
  const thoughtsQuery = supabase
    .from("thoughts")
    .select("id, content, images, created_at, status");
  type Thought = QueryData<typeof thoughtsQuery>[number];
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
    <EditorProvider editorComponent={ThoughtEditor}>
      <div className="space-y-6">
        <HeaderSection title="Thoughts">
          <NewThoughtButton />
        </HeaderSection>

        <ThoughtTimeline
          thoughts={safeThoughts}
          renderMetaRight={(thought) => (
            <StatusBadge status={thought.status ?? null} />
          )}
          renderActions={(thought) => <ThoughtActions thoughtId={thought.id} />}
        />
      </div>
    </EditorProvider>
  );
}
