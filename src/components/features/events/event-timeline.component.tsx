import { groupBy } from "es-toolkit";

import SectionCard from "#components/ui/section-card.component";
import Stack from "#components/ui/stack.component";
import { useT } from "#i18n";
import { cn } from "#lib/shared/utils";
import { formatTime } from "#lib/shared/utils/date.helper";

import EventCard, { type Event } from "./event-card.component";

interface Props {
  events: Event[];
  renderActions?: (event: Event) => React.ReactNode;
}

export default function EventTimeline({ events, renderActions }: Props) {
  const t = useT();

  const groupedEvents = groupBy(events, (event) =>
    formatTime(event.published_at, "YYYY", "Unknown"),
  );
  const sortedYears = Object.entries(groupedEvents).sort(([a], [b]) => {
    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;
    return Number(b) - Number(a);
  });

  return (
    <Stack y className="relative mt-8">
      {/* Timeline Axis */}
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 transform bg-zinc-200 dark:bg-zinc-800" />

      {sortedYears.map(([year, yearEvents]) => {
        return (
          <Stack y key={year} className="mb-12">
            {/* Year Title */}
            <Stack x className="mb-8 justify-center">
              <h2 className="z-10 rounded-full bg-blue-500 px-4 py-1 text-lg font-bold text-white">
                {year === "Unknown" ? t((d) => d.common.unknownYear) : year}
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
                      "top-0 left-1/2 -translate-1/2",
                      "sm:top-1/2 sm:left-1/2 sm:-translate-1/2",
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
                    <EventCard event={event} renderActions={renderActions} />
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
