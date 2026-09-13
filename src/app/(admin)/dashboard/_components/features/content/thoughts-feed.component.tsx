import * as stylex from "@stylexjs/stylex";

import { formatTime } from "#lib/shared/utils/date.helper";

import { listStyles as styles } from "./content-list.style";
import type { ContentListViewProps } from "./content-list.type";
export function ThoughtsFeed({
  items,
  page,
  visibility,
  actions,
  body,
}: ContentListViewProps) {
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
            <div {...stylex.props(styles.actions)}>
              {visibility(item)}
              {actions(item)}
            </div>
          </header>
          {body(item)}
        </article>
      ))}
    </div>
  );
}
