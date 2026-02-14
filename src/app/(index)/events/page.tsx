import { Metadata } from "next";

import EventTimeline from "@/components/features/events/EventTimeline";
import { fetchCachedEvents } from "@/lib/server/services-cache/events";

import CollectionBody from "../components/CollectionBody";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Events",
};

export default async function EventsPage() {
  const events = await fetchCachedEvents();

  const totalEvents = events.length;

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
      <EventTimeline events={events} />
    </CollectionBody>
  );
}
