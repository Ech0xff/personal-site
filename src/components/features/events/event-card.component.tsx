import type { CSSProperties } from "react";

import { EventContent } from "#components/features/content";
import Stack from "#components/ui/stack.component";
import { useDictionary } from "#dictionary";
import { formatTime } from "#lib/shared/utils/date.helper";
import type { Status, Tag } from "#types";

type EventTag = Tag | string;
import { DEFAULT_TAG_COLOR } from "#components/features/tags/tag.const";

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
  className?: string;
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

  const color = (tag.meta as { color?: unknown }).color;
  return typeof color === "string" && color.trim() ? color : DEFAULT_TAG_COLOR;
};

export default function EventCard({ event, className, renderActions }: Props) {
  const dictionary = useDictionary();
  const { title, content, tags, published_at } = event;
  return (
    <Stack y className={className}>
      {/* Meta Row */}
      <Stack x className="mb-2 items-center justify-between">
        <div className="font-mono text-xs text-text-muted">
          {formatTime(published_at, "MMM D", dictionary.common.unknownDate)}
        </div>
        <Stack x className="items-center gap-2">
          {renderActions?.(event)}
        </Stack>
      </Stack>
      {/* Title */}
      <h3 className="mb-3 text-xl font-bold text-text-primary">{title}</h3>
      {/* Description */}
      {content && <EventContent content={content} />}
      {/* Tags */}
      <Stack x className="mt-auto flex-wrap gap-2 py-3">
        {tags.length > 0 && (
          <>
            {tags.map((tag) => {
              const tagColor = getTagColor(tag);
              return (
                <span
                  key={getTagName(tag)}
                  className="rounded-md px-2 py-1 text-xs font-medium"
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
