import Stack from "@/components/ui/Stack";
import { getT } from "@/lib/shared/i18n/tools";
import { formatTime } from "@/lib/shared/utils/tools";
import type { Tag } from "@/types";

import { EventContent } from "../../ui/content";

type EventTag = Tag | string;
const defaultTagColor = "#71717a";

export type Event = {
  id: string;
  title: string;
  content: string;
  tags: EventTag[];
  color: string;
  status: string;
  published_at: string;
};

interface Props {
  event: Event;
  className?: string;
  locale?: string;
  renderActions?: (event: Event) => React.ReactNode;
}

const getTagName = (tag: EventTag) => {
  return typeof tag === "string" ? tag : tag.name;
};

const getTagColor = (tag: EventTag) => {
  if (typeof tag === "string") return defaultTagColor;
  if (!tag.meta || typeof tag.meta !== "object" || Array.isArray(tag.meta)) {
    return defaultTagColor;
  }

  const color = (tag.meta as { color?: unknown }).color;
  return typeof color === "string" && color.trim() ? color : defaultTagColor;
};

export default function EventCard({
  event,
  className,
  locale,
  renderActions,
}: Props) {
  const tCommon = getT("Common", locale);
  const { title, content, tags, published_at } = event;
  return (
    <Stack y className={className}>
      {/* Meta Row */}
      <Stack x className="mb-2 items-center justify-between">
        <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
          {formatTime(published_at, "MMM D", tCommon("unknownDate"))}
        </div>
        <Stack x className="items-center gap-2">
          {renderActions?.(event)}
        </Stack>
      </Stack>

      {/* Title */}
      <h3 className="mb-3 font-bold text-xl text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>

      {/* Description */}
      {content && <EventContent content={content} />}

      {/* Tags */}
      <Stack x className="mt-auto flex-wrap gap-2 py-3">
        {tags && tags.length > 0 && (
          <>
            {tags.map((tag) => {
              const tagColor = getTagColor(tag);

              return (
                <span
                  key={getTagName(tag)}
                  className="rounded-md px-2 py-1 font-medium text-xs"
                  style={{
                    backgroundColor: tagColor + "20",
                    color: tagColor,
                  }}
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
