"use client";

import { useCallback } from "react";

import EventTimeline from "#components/features/events/EventTimeline";
import { useModal } from "#components/ui/ModalProvider";
import { useCurrentLocale } from "#lib/client/locale";
import { updateEventStatusByBrowser } from "#lib/client/services";

import OpenEditorButton from "../_components/editor/OpenEditorButton";
import DashboardShell from "../_components/layout/DashboardShell";
import StatusToggle from "../_components/status/StatusToggle";
import EventActions from "./_components/EventActions";
import EventEditor from "./_components/EventEditor";
import { useEvents } from "./useEvents";

export default function EventsPage() {
  const locale = useCurrentLocale();
  const { events, loading, error, syncStatus, removeEvent, refetch } =
    useEvents();
  const { open, close } = useModal();

  const openEditor = useCallback(
    (id: string | null) => {
      open(
        <EventEditor
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
      title="Events"
      loading={loading}
      error={error}
      optActions={
        <OpenEditorButton label="New Event" openEditor={openEditor} />
      }
    >
      <EventTimeline
        events={events}
        locale={locale}
        renderActions={(event) => (
          <>
            <StatusToggle
              status={event.status}
              onChange={async (nextStatus) => {
                await updateEventStatusByBrowser(event.id, nextStatus);
                syncStatus(event.id, nextStatus);
              }}
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
