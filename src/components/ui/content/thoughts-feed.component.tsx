import * as stylex from "@stylexjs/stylex";

import { formatTime } from "#lib/shared/utils/date.helper";

import { feedStyles as styles } from "./content-feed.style";
import type { ContentFeedProps } from "./content-feed.type";
export function ThoughtsFeed({
  items,
  page = 0,
  visibility,
  actions,
  body,
}: ContentFeedProps) {
  return (
    <div {...stylex.props(styles.feed)}>
      {items.map((item, index) => (
        <article key={item.id} {...stylex.props(styles.thought)}>
          <header {...stylex.props(styles.entryHeader)}>
            <time
              dateTime={item.published_at}
              {...stylex.props(styles.timestamp)}
            >
              #{page * 30 + index + 1}　•　
              {formatTime(item.published_at, "MM/DD, HH:mm")}
            </time>
            {(visibility || actions) && (
              <div {...stylex.props(styles.entryActions)}>
                {visibility?.(item)}
                {actions?.(item)}
              </div>
            )}
          </header>
          {body(item)}
        </article>
      ))}
    </div>
  );
}
