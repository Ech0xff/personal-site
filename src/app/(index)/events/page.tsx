import { Metadata } from "next";

import EventTimeline from "@/components/EventTimeline";
import { getCachedEvents } from "@/lib/cache/events";

import CollectionBody from "../components/CollectionBody";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Events",
};

export default async function EventsPage() {
  const events = await getCachedEvents();

  const safeEvents = events.filter((e) => e.status === "show");

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
