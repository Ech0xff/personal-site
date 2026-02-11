"use client";

import { useEffect, useState } from "react";

import EventTimeline from "@/components/EventTimeline";
import { getDashboardEventsClient } from "@/lib/data/dashboard-client";
import { Event as DashboardEvent } from "@/types";

import EditorProvider from "../components/EditorProvider";
import DashboardShell from "../components/ui/DashboardShell";
import EventActions from "./components/EventActions";
import EventEditor from "./components/EventEditor";
import NewEventButton from "./components/NewEventButton";
import StatusToggle from "./components/StatusToggle";

export default function EventsPage() {
  const [events, setEvents] = useState<DashboardEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await getDashboardEventsClient();
        if (!isMounted) return;
        setEvents(data);
        setError(false);
      } catch {
        if (!isMounted) return;
        setError(true);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

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
            <StatusToggle eventId={event.id} status={event.status ?? null} />
          )}
          renderActions={(event) => <EventActions eventId={event.id} />}
        />
      </DashboardShell>
    </EditorProvider>
  );
}
