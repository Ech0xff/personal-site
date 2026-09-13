import * as stylex from "@stylexjs/stylex";
import type { CSSProperties } from "react";

import Stack from "#components/ui/stack.component";
import type { StyleInput } from "#design/style.type";
import { color, font, space, shape } from "#design/tokens.stylex";
import { useDictionary } from "#dictionary";
import { formatTime } from "#lib/shared/utils/date.helper";
import type { Status, Tag } from "#types";

import { EventContent } from "../content";
import { DEFAULT_TAG_COLOR } from "../tags/tag.const";
const styles = stylex.create({
  row: {
    marginBottom: space.xs,
    alignItems: "center",
    justifyContent: "space-between",
  },
  container: {
    fontFamily: font.mono,
    fontSize: font.small,
    lineHeight: 1.5,
    color: color.muted,
  },
  row2: {
    alignItems: "center",
    gap: space.xs,
  },
  heading: {
    marginBottom: space.sm,
    fontSize: font.large,
    lineHeight: 1.5,
    fontWeight: font.bold,
    color: color.text,
  },
  row3: {
    marginTop: "auto",
    flexWrap: "wrap",
    gap: space.xs,
    paddingTop: space.sm,
    paddingBottom: space.sm,
  },
  label: {
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    paddingLeft: space.xs,
    paddingRight: space.xs,
    paddingTop: space.xxs,
    paddingBottom: space.xxs,
    fontSize: font.small,
    lineHeight: 1.5,
    fontWeight: font.medium,
  },
});
type EventTag = Tag | string;
export type Event = {
  id: string;
  title: string;
  content: string;
  tags: EventTag[];
  color: string;
  status: Status;
  published_at: string;
};
interface Props {
  event: Event;
  xstyle?: StyleInput;
  renderActions?: (event: Event) => React.ReactNode;
}
const getTagName = (tag: EventTag) => {
  return typeof tag === "string" ? tag : tag.name;
};
const getTagColor = (tag: EventTag) => {
  if (typeof tag === "string") return DEFAULT_TAG_COLOR;
  if (!tag.meta || typeof tag.meta !== "object" || Array.isArray(tag.meta)) {
    return DEFAULT_TAG_COLOR;
  }
  const color = (
    tag.meta as {
      color?: unknown;
    }
  ).color;
  return typeof color === "string" && color.trim() ? color : DEFAULT_TAG_COLOR;
};
export default function EventCard({ event, xstyle, renderActions }: Props) {
  const dictionary = useDictionary();
  const { title, content, tags, published_at } = event;
  return (
    <Stack y xstyle={xstyle}>
      {/* Meta Row */}
      <Stack x xstyle={styles.row}>
        <div {...stylex.props(styles.container)}>
          {formatTime(published_at, "MMM D", dictionary.common.unknownDate)}
        </div>
        <Stack x xstyle={styles.row2}>
          {renderActions?.(event)}
        </Stack>
      </Stack>
      {/* Title */}
      <h3 {...stylex.props(styles.heading)}>{title}</h3>
      {/* Description */}
      {content && <EventContent content={content} />}
      {/* Tags */}
      <Stack x xstyle={styles.row3}>
        {tags.length > 0 && (
          <>
            {tags.map((tag) => {
              const tagColor = getTagColor(tag);
              return (
                <span
                  key={getTagName(tag)}
                  {...stylex.props(styles.label)}
                  style={
                    {
                      "--tag-color": tagColor,
                      backgroundColor:
                        "color-mix(in srgb, var(--tag-color) 12.5%, transparent)",
                      color: "var(--tag-color)",
                    } as CSSProperties
                  }
                >
                  {getTagName(tag)}
                </span>
              );
            })}
          </>
        )}
      </Stack>
    </Stack>
  );
}
