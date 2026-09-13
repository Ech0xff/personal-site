"use client";

import * as stylex from "@stylexjs/stylex";
import { useCallback } from "react";

import { useModal } from "#components/ui/modal-provider.component";
import { updateThoughtStatusByBrowser } from "#lib/client/services";

import OpenEditorButton from "../_components/editor/open-editor-button.component";
import ThoughtTimeline from "../_components/features/thoughts/thought-timeline.component";
import DashboardShell from "../_components/layout/dashboard-shell.component";
import StatusToggle from "../_components/status/status-toggle.component";
import ThoughtActions from "./_components/thought-actions.component";
import ThoughtEditor from "./_components/thought-editor";
import { useThoughts } from "./_hooks/thoughts.hook";
const styles = stylex.create({
  icon: {
    height: "100%",
    minHeight: "0px",
    width: "100%",
    overflow: "hidden",
  },
});
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
          xstyle={styles.icon}
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
