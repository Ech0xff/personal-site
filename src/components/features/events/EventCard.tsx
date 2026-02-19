import StackX from "@/components/ui/StackX";
import StackY from "@/components/ui/StackY";
import { formatTime } from "@/lib/shared/utils/tools";

import { EventMarkdown } from "../../ui/markdown";

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
  renderActions?: (event: Event) => React.ReactNode;
}

export default function EventCard({ event, className, renderActions }: Props) {
  const { title, content, tags, color, published_at } = event;
  return (
    <StackY className={className}>
      {/* Meta Row */}
      <StackX className="mb-2 items-center justify-between">
        <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
          {formatTime(published_at, "MMM D", "Unknown Date")}
        </div>
        <StackX className="items-center gap-2">
          {renderActions && renderActions(event)}
        </StackX>
      </StackX>

      {/* Title */}
      <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>

      {/* Description */}
      {content && <EventMarkdown content={content} />}

      {/* Tags */}
      <StackX className="mt-auto flex-wrap gap-2 py-3">
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
      </StackX>
    </StackY>
  );
}
