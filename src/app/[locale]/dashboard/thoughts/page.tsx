"use client";
import { usePathname } from "next/navigation";

import ThoughtTimeline from "@/components/features/thoughts/ThoughtTimeline";

import EditorProvider from "../_components/EditorProvider";
import DashboardShell from "../_components/ui/DashboardShell";
import StatusToggle from "./_components/StatusToggle";
import ThoughtActions from "./_components/ThoughtActions";
import ThoughtEditor, { OpenButton } from "./_components/ThoughtEditor";
import { useHooks } from "./use-hooks";

export default function ThoughtsPage() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
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
