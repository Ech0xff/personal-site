import Stack from "@/components/ui/Stack";
import { getT } from "@/lib/shared/i18n/tools";
import { formatTime } from "@/lib/shared/utils/tools";

import { EventContent } from "../../ui/content";

export type Event = {
  id: string;
  title: string;
  content: string;
  tags: string[];
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

export default function EventCard({
  event,
  className,
  locale,
  renderActions,
}: Props) {
  const tCommon = getT("Common", locale);
  const { title, content, tags, color, published_at } = event;
  return (
    <Stack y className={className}>
      {/* Meta Row */}
      <Stack x className="mb-2 items-center justify-between">
        <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
          {formatTime(published_at, "MMM D", tCommon("unknownDate"))}
        </div>
        <Stack x className="items-center gap-2">
          {renderActions && renderActions(event)}
        </Stack>
      </Stack>

      {/* Title */}
      <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>

      {/* Description */}
      {content && <EventContent content={content} />}

      {/* Tags */}
      <Stack x className="mt-auto flex-wrap gap-2 py-3">
        {tags && tags.length > 0 && (
          <>
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md px-2 py-1 text-xs font-medium"
                style={{
                  backgroundColor: color + "40",
                  color,
                }}
              >
                {tag}
              </span>
            ))}
          </>
        )}
      </Stack>
    </Stack>
  );
}
