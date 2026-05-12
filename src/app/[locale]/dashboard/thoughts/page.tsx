"use client";

import { useCallback } from "react";

import ThoughtTimeline from "#components/features/thoughts/ThoughtTimeline";
import { useModal } from "#components/ui/ModalProvider";
import { useCurrentLocale } from "#lib/client/locale";
import { updateThoughtStatusByBrowser } from "#lib/client/services";

import OpenEditorButton from "../_components/editor/OpenEditorButton";
import DashboardShell from "../_components/layout/DashboardShell";
import StatusToggle from "../_components/status/StatusToggle";
import ThoughtActions from "./_components/ThoughtActions";
import ThoughtEditor from "./_components/ThoughtEditor";
import { useThoughts } from "./useThoughts";

export default function ThoughtsPage() {
  const locale = useCurrentLocale();
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
        locale={locale}
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
