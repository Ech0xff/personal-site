import { Metadata } from "next";

import { QueryData } from "@supabase/supabase-js";

import EventTimeline from "@/components/EventTimeline";
import { supabase } from "@/lib/supabase";

import CollectionBody from "../components/CollectionBody";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events",
};

export default async function EventsPage() {
  const eventsQuery = supabase
    .from("events")
    .select("id, title, description, event_date, tags, color, created_at")
    .order("event_date", { ascending: false });
  type EventListItem = QueryData<typeof eventsQuery>[number];
  const { data: events } = await eventsQuery;

  const safeEvents: EventListItem[] = (events || []).map((e) => ({
    ...e,
    tags: e.tags || [],
  }));

  const totalEvents = safeEvents.length;

  return (
    <CollectionBody
      title="Timeline"
      description={
        <>
          A timeline of memorable moments and milestones. Total{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {totalEvents}
          </span>{" "}
          events recorded, documenting the journey.
        </>
      }
    >
      <EventTimeline events={safeEvents} />
    </CollectionBody>
  );
}
