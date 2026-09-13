import * as stylex from "@stylexjs/stylex";
import { groupBy } from "es-toolkit";
import type { CSSProperties } from "react";

import SectionCard from "#components/ui/section-card.component";
import Stack from "#components/ui/stack.component";
import { color, font, space, shape, motionToken } from "#design/tokens.stylex";
import { useDictionary } from "#dictionary";
import { formatTime } from "#lib/shared/utils/date.helper";

import EventCard, { type Event } from "./event-card.component";
const styles = stylex.create({
  column: {
    position: "relative",
    marginTop: space.xl,
  },
  container: {
    position: "absolute",
    top: "0px",
    bottom: "0px",
    left: "50%",
    width: "2px",
    translate: "-50% 0",
    backgroundColor: color.surfaceStrong,
  },
  column2: {
    marginBottom: space.xxl,
  },
  row: {
    marginBottom: space.xl,
    justifyContent: "center",
  },
  heading: {
    zIndex: 10,
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    backgroundColor: color.accent,
    paddingLeft: space.md,
    paddingRight: space.md,
    paddingTop: space.xxs,
    paddingBottom: space.xxs,
    fontSize: font.navigation,
    lineHeight: 1.5,
    fontWeight: font.bold,
    color: color.onAccent,
  },
  column3: {
    gap: space.xl,
  },
  row2: {
    position: "relative",
    scrollMarginTop: "96px",
  },
  row3: {
    flexDirection: "row",
  },
  row4: {
    flexDirection: "row-reverse",
  },
  sectionCard2: {
    marginRight: {
      default: null,
      "@media (min-width: 640px)": "auto",
    },
    paddingRight: {
      default: null,
      "@media (min-width: 768px)": space.xl,
    },
  },
  sectionCard3: {
    marginLeft: {
      default: null,
      "@media (min-width: 640px)": "auto",
    },
    paddingLeft: {
      default: null,
      "@media (min-width: 768px)": space.xl,
    },
  },
  container2: {
    position: "absolute",
    zIndex: 10,
    aspectRatio: "1",
    height: "20px",
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    transitionDuration: motionToken.fast,
    top: {
      default: "0px",
      "@media (min-width: 640px)": "50%",
    },
    left: {
      default: "50%",
      "@media (min-width: 640px)": "50%",
    },
    translate: {
      default: "-50% -50%",
      "@media (min-width: 640px)": "-50% -50%",
    },
  },
  sectionCard: {
    position: "relative",
    width: {
      default: "100%",
      "@media (min-width: 640px)": "calc(50% - 2rem)",
    },
    transitionDuration: motionToken.fast,
  },
});
interface Props {
  events: Event[];
  renderActions?: (event: Event) => React.ReactNode;
}
export default function EventTimeline({ events, renderActions }: Props) {
  const dictionary = useDictionary();
  const groupedEvents = groupBy(events, (event) =>
    formatTime(event.published_at, "YYYY", "Unknown"),
  );
  const sortedYears = Object.entries(groupedEvents).sort(([a], [b]) => {
    if (a === "Unknown") return 1;
    if (b === "Unknown") return -1;
    return Number(b) - Number(a);
  });
  return (
    <Stack y xstyle={styles.column}>
      {/* Timeline Axis */}
      <div {...stylex.props(styles.container)} />
      {sortedYears.map(([year, yearEvents]) => {
        return (
          <Stack y key={year} xstyle={styles.column2}>
            {/* Year Title */}
            <Stack x xstyle={styles.row}>
              <h2 {...stylex.props(styles.heading)}>
                {year === "Unknown" ? dictionary.common.unknownYear : year}
              </h2>
            </Stack>
            {/* Events List */}
            <Stack y xstyle={styles.column3}>
              {yearEvents.map((event, index) => (
                <Stack
                  x
                  key={event.id}
                  id={event.id}
                  xstyle={[
                    styles.row2,
                    index % 2 === 0 ? styles.row3 : styles.row4,
                  ]}
                >
                  {/* Dot */}
                  <div
                    {...stylex.props([styles.container2])}
                    style={
                      {
                        "--event-color": event.color,
                        backgroundColor: "var(--event-color)",
                      } as CSSProperties & {
                        "--event-color": string;
                      }
                    }
                  />
                  <SectionCard
                    xstyle={[
                      styles.sectionCard,
                      index % 2 === 0
                        ? styles.sectionCard2
                        : styles.sectionCard3,
                    ]}
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
