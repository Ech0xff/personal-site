"use client";

import ThoughtTimeline from "@/lib/shared/utils/thoughts/ThoughtTimeline";

import EditorProvider from "../components/EditorProvider";
import DashboardShell from "../components/ui/DashboardShell";
import StatusToggle from "./components/StatusToggle";
import ThoughtActions from "./components/ThoughtActions";
import ThoughtEditor, { OpenButton } from "./components/ThoughtEditor";
import { useHooks } from "./use-hooks";

export default function ThoughtsPage() {
  const { thoughts, loading, error, syncStatus, removeThought, refetch } =
    useHooks();

  return (
    <EditorProvider editorComponent={ThoughtEditor} onSaved={refetch}>
      <DashboardShell
        title="Thoughts"
        loading={loading}
        error={error}
        optActions={<OpenButton />}
      >
        <ThoughtTimeline
          thoughts={thoughts}
          renderActions={(thought) => {
            return (
              <>
                <StatusToggle
                  thoughtId={thought.id}
                  status={thought.status}
                  successCallback={syncStatus}
                />
                <ThoughtActions
                  thoughtId={thought.id}
                  successCallback={removeThought}
                />
              </>
            );
          }}
        />
      </DashboardShell>
    </EditorProvider>
  );
}
