import Link from "next/link";

import { QueryData } from "@supabase/supabase-js";
import { Calendar, Edit, Plus, Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabase";

import HeaderSection from "../components/HeaderSection";

const eventsQuery = supabase.from("events").select("*");
type Event = QueryData<typeof eventsQuery>[number];

export default async function EventsPage() {
  const { data: events, error } = await eventsQuery.order("event_date", {
    ascending: false,
  });

  if (error) {
    console.error("Error fetching events:", error);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays > 0) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <HeaderSection title="Events">
        <Link
          href="/dashboard/events/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Event
        </Link>
      </HeaderSection>

      {/* Events Timeline */}
      <div className="space-y-4">
        {events &&
          events.map((event) => (
            <div
              key={event.id}
              className="group relative flex gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              {/* Color Indicator */}
              <div
                className="h-12 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: event.color || "#3b82f6" }}
              />

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {event.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(event.event_date)}</span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        ({getRelativeTime(event.event_date)})
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Description */}
                {event.description && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {event.description}
                  </p>
                )}

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {event.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
