"use client";

import { useCallback } from "react";

import EventTimeline from "@/components/features/events/EventTimeline";
import { useModal } from "@/components/ui/ModalProvider";
import { useCurrentLocale } from "@/lib/client/locale";

import DashboardShell from "../_components/ui/DashboardShell";
import EventActions from "./_components/EventActions";
import EventEditor, { OpenButton } from "./_components/EventEditor";
import StatusToggle from "./_components/StatusToggle";
import { useHooks } from "./use-hooks";

export default function EventsPage() {
  const locale = useCurrentLocale();
  const { events, loading, error, syncStatus, removeEvent, refetch } =
    useHooks();
  const { open, close } = useModal();

  const openEditor = useCallback(
    (id: string | null) => {
      open(
        <EventEditor
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
      title="Events"
      loading={loading}
      error={error}
      optActions={<OpenButton openEditor={openEditor} />}
    >
      <EventTimeline
        events={events}
        locale={locale}
        renderActions={(event) => (
          <>
            <StatusToggle
              eventId={event.id}
              status={event.status}
              successCallback={syncStatus}
            />
            <EventActions
              eventId={event.id}
              successCallback={removeEvent}
              openEditor={openEditor}
            />
          </>
        )}
      />
    </DashboardShell>
  );
}
