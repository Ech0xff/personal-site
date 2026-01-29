import Link from "next/link";

import { QueryData } from "@supabase/supabase-js";
import { Edit, Plus, Trash2 } from "lucide-react";

import EventTimeline, { EventItem } from "@/components/EventTimeline";
import { supabase } from "@/lib/supabase";

import HeaderSection from "../components/HeaderSection";
import { deleteEvent } from "./actions";

const eventsQuery = supabase
  .from("events")
  .select("id, title, description, event_date, tags, color, created_at");
type Event = QueryData<typeof eventsQuery>[number];

function EventActions({ event }: { event: EventItem }) {
  const deleteWithId = deleteEvent.bind(null, event.id);

  return (
    <>
      <Link
        href={`/dashboard/event/${event.id}`}
        className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Link>
      <form action={deleteWithId} className="inline">
        <button
          type="submit"
          className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          title="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </form>
    </>
  );
}

export default async function EventsPage() {
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
    <div className="space-y-6">
      <HeaderSection title="Events">
        <Link
          href="/dashboard/event/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Event
        </Link>
      </HeaderSection>

      <EventTimeline
        events={safeEvents}
        renderActions={(event) => <EventActions event={event} />}
      />
    </div>
  );
}
