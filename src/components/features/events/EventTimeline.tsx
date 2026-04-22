import SectionCard from "@/components/ui/SectionCard";
import Stack from "@/components/ui/Stack";
import { getT } from "@/lib/shared/i18n/tools";
import { cn, formatTime } from "@/lib/shared/utils";

import EventCard, { type Event } from "./EventCard";

interface Props {
  events: Event[];
  locale?: string;
  renderActions?: (event: Event) => React.ReactNode;
}

export default function EventTimeline({
  events,
  locale,
  renderActions,
}: Props) {
  const tCommon = getT("Common", locale);

  // Group by year
  const groupedEvents: Record<string, Event[]> = {};
  events.forEach((event) => {
    const year = formatTime(event.published_at, "YYYY", "Unknown");
    if (!groupedEvents[year]) {
      groupedEvents[year] = [];
    }
    groupedEvents[year].push(event);
  });

  // Sort years descending
  const sortedYears = Object.keys(groupedEvents).sort((a, b) => {
    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;
    return Number(b) - Number(a);
  });

  return (
    <Stack y className="relative mt-8">
      {/* Timeline Axis */}
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 transform bg-zinc-200 dark:bg-zinc-800" />

      {sortedYears.map((year) => {
        const yearEvents = groupedEvents[year] || [];
        return (
          <Stack y key={year} className="mb-12">
            {/* Year Title */}
            <Stack x className="mb-8 justify-center">
              <h2 className="z-10 rounded-full bg-blue-500 px-4 py-1 font-bold text-lg text-white">
                {year === "Unknown" ? tCommon("unknownYear") : year}
              </h2>
            </Stack>

            {/* Events List */}
            <Stack y className="gap-8">
              {yearEvents.map((event, index) => (
                <Stack
                  x
                  key={event.id}
                  id={event.id}
                  className={cn(
                    "relative scroll-mt-24",
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse",
                  )}
                >
                  {/* Dot */}
                  <div
                    className={cn(
                      "absolute z-10 aspect-square h-5 rounded-full duration-300",
                      "-translate-1/2 top-0 left-1/2",
                      "sm:-translate-1/2 sm:top-1/2 sm:left-1/2",
                    )}
                    style={{ backgroundColor: event.color }}
                  />
                  <SectionCard
                    className={cn(
                      "relative w-full duration-300",
                      "w-full",
                      "sm:w-[calc(50%-2rem)]",
                      index % 2 === 0
                        ? "sm:mr-auto md:pr-8"
                        : "sm:ml-auto md:pl-8",
                    )}
                  >
                    <EventCard
                      event={event}
                      locale={locale}
                      renderActions={renderActions}
                    />
                  </SectionCard>
                </Stack>
              ))}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
}
