import { EventMarkdown } from "@/components/markdown";

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  published_at?: string | null;
  tags: string[] | null;
  color: string | null;
  created_at: string | null;
  status?: string | null;
}

interface EventTimelineProps {
  events: EventItem[];
  renderMetaRight?: (event: EventItem) => React.ReactNode;
  renderActions?: (event: EventItem) => React.ReactNode;
}

export default function EventTimeline({
  events,
  renderMetaRight,
  renderActions,
}: EventTimelineProps) {
  // Format date helper
  const formatEventDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Group by year
  const groupedEvents: Record<string, EventItem[]> = {};
  events.forEach((event) => {
    const effectiveDate = event.published_at || event.event_date;
    const year = new Date(effectiveDate).getFullYear().toString();
    if (!groupedEvents[year]) {
      groupedEvents[year] = [];
    }
    groupedEvents[year].push(event);
  });

  // Sort years descending
  const sortedYears = Object.keys(groupedEvents).sort(
    (a, b) => Number(b) - Number(a),
  );

  return (
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
                  className={`group relative flex items-start ${
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
                    {/* Meta Row */}
                    <div className="mb-3 flex items-center justify-between">
                      <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
                        {formatEventDate(event.published_at || event.event_date)}
                      </div>
                      <div className="flex items-center gap-2">
                        {renderMetaRight && renderMetaRight(event)}
                        {renderActions && (
                          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            {renderActions(event)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                      {event.title}
                    </h3>

                    {/* Description */}
                    {event.description && (
                      <EventMarkdown content={event.description} />
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
  );
}
