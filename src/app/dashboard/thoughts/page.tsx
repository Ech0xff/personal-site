import { QueryData } from "@supabase/supabase-js";

import ThoughtTimeline from "@/components/ThoughtTimeline";
import { createClient } from "@/lib/supabase/server";

import EditorProvider from "../components/EditorProvider";
import HeaderSection from "../components/HeaderSection";
import NewThoughtButton from "./components/NewThoughtButton";
import ThoughtActions from "./components/ThoughtActions";
import ThoughtEditor from "./components/ThoughtEditor";

export default async function ThoughtsPage() {
  const supabase = await createClient();
  const thoughtsQuery = supabase
    .from("thoughts")
    .select("id, content, images, created_at");
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
          renderActions={(thought) => <ThoughtActions thoughtId={thought.id} />}
        />
      </div>
    </EditorProvider>
  );
}
