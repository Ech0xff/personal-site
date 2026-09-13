import * as stylex from "@stylexjs/stylex";
import { Fragment } from "react";

import { Magnetic } from "#components/ui/magnetic.component";
import { formatTime } from "#lib/shared/utils/date.helper";

import { feedStyles as styles } from "./content-feed.style";
import type { ContentFeedProps } from "./content-feed.type";
export function EventsTimeline({
  items,
  visibility,
  actions,
  body,
}: ContentFeedProps) {
  return (
    <div {...stylex.props(styles.timeline)}>
      <div aria-hidden {...stylex.props(styles.axis)} />
      {items.map((item, index) => {
        const year = formatTime(item.published_at, "YYYY");
        const newYear =
          index === 0 ||
          year !== formatTime(items[index - 1].published_at, "YYYY");
        return (
          <Fragment key={item.id}>
            {newYear && (
              <h3 {...stylex.props(styles.yearAnchor)}>
                <Magnetic>
                  <span {...stylex.props(styles.year)}>{year}</span>
                </Magnetic>
              </h3>
            )}
            <article
              {...stylex.props(
                styles.event,
                index % 2 === 1 && styles.eventRight,
              )}
            >
              <span
                aria-hidden
                {...stylex.props(
                  styles.dot,
                  index % 2 === 1 && styles.dotRight,
                )}
              >
                <Magnetic compact>
                  <span
                    {...stylex.props(styles.dotFill)}
                    style={{ backgroundColor: item.color }}
                  />
                </Magnetic>
              </span>
              <div {...stylex.props(styles.eventCard)}>
                <header {...stylex.props(styles.entryHeader)}>
                  <time
                    dateTime={item.published_at}
                    {...stylex.props(styles.timestamp)}
                  >
                    <Magnetic compact>
                      {formatTime(item.published_at, "MMM D")}
                    </Magnetic>
                  </time>
                  <div {...stylex.props(styles.entryActions)}>
                    {visibility?.(item)}
                    {actions?.(item)}
                  </div>
                </header>
                {body(item)}
              </div>
            </article>
          </Fragment>
        );
      })}
    </div>
  );
}
