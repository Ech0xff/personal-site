import ReactMarkdown from "react-markdown";

import { Metadata } from "next";

import { QueryData } from "@supabase/supabase-js";
import remarkGfm from "remark-gfm";

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

  // Group by year
  const groupedEvents: Record<string, EventListItem[]> = {};
  safeEvents.forEach((event) => {
    const year = new Date(event.event_date).getFullYear().toString();
    if (!groupedEvents[year]) {
      groupedEvents[year] = [];
    }
    groupedEvents[year].push(event);
  });

  // Sort years descending
  const sortedYears = Object.keys(groupedEvents).sort(
    (a, b) => Number(b) - Number(a),
  );

  // Format date helper
  const formatEventDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

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
      {/* Timeline */}
      {safeEvents.length > 0 ? (
        <div className="relative mt-8">
          {/* Timeline Axis */}
          <div className="absolute top-0 bottom-0 left-4 w-0.5 transform bg-zinc-200 md:left-1/2 md:-translate-x-1/2 dark:bg-zinc-800"></div>

          {sortedYears.map((year) => {
            const yearEvents = groupedEvents[year] || [];
            return (
              <div key={year} className="mb-12">
                {/* Year Title */}
                <div className="relative mb-8 flex items-center">
                  <h2 className="z-10 ml-12 rounded-full bg-blue-500 px-4 py-1 text-lg font-bold text-white md:absolute md:left-1/2 md:ml-0 md:-translate-x-1/2 md:transform">
                    {year}
                  </h2>
                </div>

                {/* Events List */}
                <div className="space-y-8">
                  {yearEvents.map((event, index) => (
                    <div
                      key={event.id}
                      className={`relative flex items-start ${
                        index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                    >
                      {/* Dot */}
                      <div
                        className="absolute left-4 z-10 mt-2 h-3 w-3 -translate-x-1/2 transform rounded-full ring-4 ring-white md:left-1/2 md:-translate-x-1/2 dark:ring-zinc-950"
                        style={{ backgroundColor: event.color || "#3B82F6" }}
                      ></div>

                      {/* Card */}
                      <div
                        className={`ml-12 rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm hover:shadow-md md:ml-0 md:w-[calc(50%-2rem)] dark:border-zinc-800 dark:bg-zinc-900/80 ${
                          index % 2 === 0
                            ? "md:mr-auto md:pr-8"
                            : "md:ml-auto md:pl-8"
                        } `}
                      >
                        {/* Date */}
                        <div className="mb-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                          {formatEventDate(event.event_date)}
                        </div>

                        {/* Title */}
                        <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                          {event.title}
                        </h3>

                        {/* Description */}
                        {event.description && (
                          <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {event.description}
                            </ReactMarkdown>
                          </div>
                        )}

                        {/* Tags */}
                        {event.tags && event.tags.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {event.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md px-2 py-1 text-xs font-medium"
                                style={{
                                  backgroundColor:
                                    (event.color || "#3B82F6") + "20",
                                  color: event.color || "#3B82F6",
                                }}
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
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 text-6xl">📅</div>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            No events found, stay tuned...
          </p>
        </div>
      )}
    </CollectionBody>
  );
}
