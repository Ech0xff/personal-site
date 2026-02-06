import EventTimeline from "@/components/EventTimeline";
import { getDashboardEvents } from "@/lib/data/dashboard";

import EditorProvider from "../components/EditorProvider";
import HeaderSection from "../components/HeaderSection";
import EventActions from "./components/EventActions";
import EventEditor from "./components/EventEditor";
import NewEventButton from "./components/NewEventButton";
import StatusToggle from "./components/StatusToggle";

export default async function EventsPage() {
  const events = await getDashboardEvents();

  return (
    <EditorProvider editorComponent={EventEditor}>
      <div className="space-y-6">
        <HeaderSection title="Events">
          <NewEventButton />
        </HeaderSection>

        <EventTimeline
          events={events}
          renderMetaRight={(event) => (
            <StatusToggle eventId={event.id} status={event.status ?? null} />
          )}
          renderActions={(event) => <EventActions eventId={event.id} />}
        />
      </div>
    </EditorProvider>
  );
}
