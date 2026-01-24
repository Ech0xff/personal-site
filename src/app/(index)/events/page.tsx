import { Metadata } from "next";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CollectionBody from "../components/CollectionBody";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Events",
};

interface EventListItem {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  tags: string[] | null;
  color: string | null;
  created_at: string;
}

export default async function EventsPage() {
  const { data: events } = await supabase
    .from("events")
    .select("id, title, description, event_date, tags, color, created_at")
    .order("event_date", { ascending: false });

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
          <span className="text-zinc-900 dark:text-zinc-100 font-bold">
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
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-zinc-200 dark:bg-zinc-800 transform md:-translate-x-1/2"></div>

          {sortedYears.map((year) => {
            const yearEvents = groupedEvents[year] || [];
            return (
              <div key={year} className="mb-12">
                {/* Year Title */}
                <div className="relative flex items-center mb-8">
                  <h2 className="ml-12 md:ml-0 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-lg font-bold z-10">
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
                        className="absolute left-4 md:left-1/2 w-3 h-3 rounded-full transform -translate-x-1/2 md:-translate-x-1/2 z-10 mt-2 ring-4 ring-white dark:ring-zinc-950"
                        style={{ backgroundColor: event.color || "#3B82F6" }}
                      ></div>

                      {/* Card */}
                      <div
                        className={`
                        ml-12 md:ml-0 md:w-[calc(50%-2rem)]
                        bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-md
                        ${
                          index % 2 === 0
                            ? "md:mr-auto md:pr-8"
                            : "md:ml-auto md:pl-8"
                        }
                      `}
                      >
                        {/* Date */}
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-mono">
                          {formatEventDate(event.event_date)}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-zinc-50">
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
                          <div className="flex gap-2 mt-4 flex-wrap">
                            {event.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs rounded-md font-medium"
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
        <div className="text-center py-20 flex flex-col items-center justify-center">
          <div className="text-6xl mb-6">📅</div>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            No events found, stay tuned...
          </p>
        </div>
      )}
    </CollectionBody>
  );
}
