import { cn } from "@/lib/shared/utils";
import { formatTime } from "@/lib/shared/utils/tools";
import { EventMarkdown } from "../markdown";

type Event = {
  title: string;
  description: string;
  tags: string[];
  color: string;
  published_at: string;
};

interface Props {
  event: Event;
  className?: string;
  renderActions?: (event: Event) => React.ReactNode;
}

export default function EventCard({ event, className, renderActions }: Props) {
  const { title, description, tags, color, published_at } = event;
  return (
    <div className={cn("rounded-2xl flex flex-col", className)}>
      {/* Meta Row */}
      <div className="mb-3 flex items-center justify-between">
        <div className="font-mono text-xs text-zinc-500 dark:text-zinc-400">
          {published_at
            ? formatTime(published_at, "MMM D", "Unknown Date")
            : "Unknown Date"}
        </div>
        <div className="flex items-center gap-2">
          {renderActions && (
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              {renderActions(event)}
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">
        {title}
      </h3>

      {/* Description */}
      {description && <EventMarkdown content={description} />}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md px-2 py-1 text-xs font-medium"
              style={{
                backgroundColor: (color || "#3B82F6") + "40",
                color: color || "#3B82F6",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
