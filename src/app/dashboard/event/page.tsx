import { QueryData } from "@supabase/supabase-js";

import EventTimeline from "@/components/EventTimeline";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { Status } from "@/types";

import EditorProvider from "../components/EditorProvider";
import HeaderSection from "../components/HeaderSection";
import EventActions from "./components/EventActions";
import EventEditor from "./components/EventEditor";
import NewEventButton from "./components/NewEventButton";

function StatusBadge({ status }: { status: Status | null }) {
  const styles = {
    show: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    hide: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  };
  const statusKey = status as keyof typeof styles;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        styles[statusKey] || styles.hide,
      )}
    >
      {statusKey === "show" ? "Show" : "Hide"}
    </span>
  );
}

export default async function EventsPage() {
  const supabase = await createClient();
  const eventsQuery = supabase
    .from("events")
    .select(
      "id, title, description, event_date, tags, color, created_at, status",
    );
  type Event = QueryData<typeof eventsQuery>[number];
  const { data: events, error } = await eventsQuery.order("event_date", {
    ascending: false,
  });

  if (error) {
    console.error("Error fetching events:", error);
  }

  const safeEvents: Event[] = (events || []).map((e) => ({
    ...e,
    tags: e.tags || [],
  }));

  return (
    <EditorProvider editorComponent={EventEditor}>
      <div className="space-y-6">
        <HeaderSection title="Events">
          <NewEventButton />
        </HeaderSection>

        <EventTimeline
          events={safeEvents}
          renderMetaRight={(event) => (
            <StatusBadge status={event.status ?? null} />
          )}
          renderActions={(event) => <EventActions eventId={event.id} />}
        />
      </div>
    </EditorProvider>
  );
}
