import { QueryData } from "@supabase/supabase-js";

import EventTimeline from "@/components/EventTimeline";
import { createClient } from "@/lib/supabase/server";

import EditorProvider from "../components/EditorProvider";
import HeaderSection from "../components/HeaderSection";
import EventActions from "./components/EventActions";
import EventEditor from "./components/EventEditor";
import NewEventButton from "./components/NewEventButton";

export default async function EventsPage() {
  const supabase = await createClient();
  const eventsQuery = supabase
    .from("events")
    .select("id, title, description, event_date, tags, color, created_at");
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
          renderActions={(event) => <EventActions eventId={event.id} />}
        />
      </div>
    </EditorProvider>
  );
}
