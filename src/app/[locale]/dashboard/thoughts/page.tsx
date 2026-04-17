"use client";

import ThoughtTimeline from "@/components/features/thoughts/ThoughtTimeline";
import { useCurrentLocale } from "@/lib/client/locale";

import EditorProvider from "../_components/EditorProvider";
import DashboardShell from "../_components/ui/DashboardShell";
import StatusToggle from "./_components/StatusToggle";
import ThoughtActions from "./_components/ThoughtActions";
import ThoughtEditor, { OpenButton } from "./_components/ThoughtEditor";
import { useHooks } from "./use-hooks";

export default function ThoughtsPage() {
  const locale = useCurrentLocale();
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
          locale={locale}
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
