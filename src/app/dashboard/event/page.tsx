"use client";

import EventTimeline from "@/components/EventTimeline";

import EditorProvider from "../components/EditorProvider";
import DashboardShell from "../components/ui/DashboardShell";
import EventActions from "./components/EventActions";
import EventEditor from "./components/EventEditor";
import NewEventButton from "./components/NewEventButton";
import StatusToggle from "./components/StatusToggle";
import { useHooks } from "./use-hooks";

export default function EventsPage() {
  const { events, loading, error, syncStatus, removeEvent } = useHooks();

  return (
    <EditorProvider editorComponent={EventEditor}>
      <DashboardShell
        title="Events"
        loading={loading}
        error={error}
        optActions={<NewEventButton />}
        className="space-y-6"
      >
        <EventTimeline
          events={events}
          renderMetaRight={(event) => (
            <StatusToggle
              eventId={event.id}
              status={event.status ?? null}
              successCallback={syncStatus}
            />
          )}
          renderActions={(event) => (
            <EventActions eventId={event.id} successCallback={removeEvent} />
          )}
        />
      </DashboardShell>
    </EditorProvider>
  );
}
