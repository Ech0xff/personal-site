"use client";

import { useCallback } from "react";

import ThoughtTimeline from "#components/features/thoughts/thought-timeline.component";
import { useModal } from "#components/ui/modal-provider.component";
import { updateThoughtStatusByBrowser } from "#lib/client/services";

import OpenEditorButton from "../_components/editor/open-editor-button.component";
import DashboardShell from "../_components/layout/dashboard-shell.component";
import StatusToggle from "../_components/status/status-toggle.component";
import ThoughtActions from "./_components/thought-actions.component";
import ThoughtEditor from "./_components/thought-editor";
import { useThoughts } from "./_hooks/thoughts.hook";

export default function ThoughtsPage() {
  const { thoughts, loading, error, syncStatus, removeThought, refetch } =
    useThoughts();
  const { open, close } = useModal();

  const openEditor = useCallback(
    (id: string | null) => {
      open(
        <ThoughtEditor
          key={id || "new"}
          id={id}
          onClose={() => close()}
          onSaved={async () => {
            await refetch();
            close();
          }}
          className="h-full min-h-0 w-full overflow-hidden"
        />,
      );
    },
    [close, open, refetch],
  );

  return (
    <DashboardShell
      title="Thoughts"
      loading={loading}
      error={error}
      optActions={
        <OpenEditorButton label="New Thought" openEditor={openEditor} />
      }
    >
      <ThoughtTimeline
        thoughts={thoughts}
        renderActions={(thought) => {
          return (
            <>
              <StatusToggle
                status={thought.status}
                onChange={async (nextStatus) => {
                  await updateThoughtStatusByBrowser(thought.id, nextStatus);
                  syncStatus(thought.id, nextStatus);
                }}
              />
              <ThoughtActions
                thoughtId={thought.id}
                successCallback={removeThought}
                openEditor={openEditor}
              />
            </>
          );
        }}
      />
    </DashboardShell>
  );
}
