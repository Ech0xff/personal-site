"use client";

import EventTimeline from "@/components/EventTimeline";

import EditorProvider from "../components/EditorProvider";
import DashboardShell from "../components/ui/DashboardShell";
import EventActions from "./components/EventActions";
import EventEditor, { OpenButton } from "./components/EventEditor";
import StatusToggle from "./components/StatusToggle";
import { useHooks } from "./use-hooks";

export default function EventsPage() {
  const { events, loading, error, syncStatus, removeEvent, refetch } =
    useHooks();

  return (
    <EditorProvider editorComponent={EventEditor} onSaved={refetch}>
      <DashboardShell
        title="Events"
        loading={loading}
        error={error}
        optActions={<OpenButton />}
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
