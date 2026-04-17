"use client";

import EventTimeline from "@/components/features/events/EventTimeline";
import { useCurrentLocale } from "@/lib/client/locale";

import EditorProvider from "../_components/EditorProvider";
import DashboardShell from "../_components/ui/DashboardShell";
import EventActions from "./_components/EventActions";
import EventEditor, { OpenButton } from "./_components/EventEditor";
import StatusToggle from "./_components/StatusToggle";
import { useHooks } from "./use-hooks";

export default function EventsPage() {
  const locale = useCurrentLocale();
  const { events, loading, error, syncStatus, removeEvent, refetch } =
    useHooks();

  return (
    <EditorProvider editorComponent={EventEditor} onSaved={refetch}>
      <DashboardShell
        title="Events"
        loading={loading}
        error={error}
        optActions={<OpenButton />}
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
              <EventActions eventId={event.id} successCallback={removeEvent} />
            </>
          )}
        />
      </DashboardShell>
    </EditorProvider>
  );
}
