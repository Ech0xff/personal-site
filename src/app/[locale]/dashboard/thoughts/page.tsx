"use client";

import { useCallback } from "react";

import ThoughtTimeline from "@/components/features/thoughts/ThoughtTimeline";
import { useModal } from "@/components/ui/ModalProvider";
import { useCurrentLocale } from "@/lib/client/locale";

import DashboardShell from "../_components/ui/DashboardShell";
import StatusToggle from "./_components/StatusToggle";
import ThoughtActions from "./_components/ThoughtActions";
import ThoughtEditor, { OpenButton } from "./_components/ThoughtEditor";
import { useHooks } from "./use-hooks";

export default function ThoughtsPage() {
  const locale = useCurrentLocale();
  const { thoughts, loading, error, syncStatus, removeThought, refetch } =
    useHooks();
  const { open, close } = useModal();

  const openEditor = useCallback(
    (id: string | null) => {
      open(
        <ThoughtEditor
          key={id || "new"}
          id={id}
          onClose={close}
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
      optActions={<OpenButton openEditor={openEditor} />}
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
                openEditor={openEditor}
              />
            </>
          );
        }}
      />
    </DashboardShell>
  );
}
