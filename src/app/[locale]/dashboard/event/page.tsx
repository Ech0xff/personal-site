"use client";

import { useCallback } from "react";

import EventTimeline from "#components/features/events/event-timeline.component";
import { useModal } from "#components/ui/modal-provider.component";
import { updateEventStatusByBrowser } from "#lib/client/services";

import OpenEditorButton from "../_components/editor/open-editor-button.component";
import DashboardShell from "../_components/layout/dashboard-shell.component";
import StatusToggle from "../_components/status/status-toggle.component";
import EventActions from "./_components/event-actions.component";
import EventEditor from "./_components/event-editor";
import { useEvents } from "./_hooks/events.hook";

export default function EventsPage() {
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
