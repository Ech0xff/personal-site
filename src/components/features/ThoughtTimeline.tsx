import LightboxImage from "@/components/ui/Image";
import { ThoughtMarkdown } from "@/components/ui/markdown";
import { cn, formatTime } from "@/lib/shared/utils";

export interface ThoughtItem {
  id?: string;
  content: string;
  images: string[] | null;
  published_at?: string | null;
  created_at: string | null;
  status?: string | null;
}

interface ThoughtTimelineProps {
  thoughts: ThoughtItem[];
  totalCount?: number;
  className?: string;
  renderMetaRight?: (thought: ThoughtItem) => React.ReactNode;
  renderActions?: (thought: ThoughtItem) => React.ReactNode;
}

export default function ThoughtTimeline({
  thoughts,
  totalCount,
  renderMetaRight,
  renderActions,
  className,
}: ThoughtTimelineProps) {
  const total = totalCount ?? thoughts.length;

  return (
    <div
      className={cn(
        "mt-4 space-y-12 border-l border-zinc-200 pt-1 pl-6 dark:border-zinc-800",
        className,
      )}
    >
      {thoughts.map((thought, index) => (
        <div key={thought.id ?? `preview-${index}`} className="group">
          {/* Meta Row */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3 font-mono text-xs text-zinc-400 dark:text-zinc-500">
              <span className="font-bold text-zinc-500 dark:text-zinc-400">
                #{thought.id ? total - index : "preview"}
              </span>
              <span>•</span>
              <span>
                {formatTime(
                  thought.published_at || null,
                  "MM/DD, HH:mm",
                  "Unknown Date",
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {renderMetaRight && renderMetaRight(thought)}
              {renderActions && (
                <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {renderActions(thought)}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <ThoughtMarkdown content={thought.content} className="mb-4" />

          {/* Images Grid */}
          {thought.images && thought.images.length > 0 && (
            <div
              className={cn(
                "mt-4 grid gap-2",
                "grid-cols-6 gap-2 md:grid-cols-8 lg:grid-cols-10",
              )}
            >
              {thought.images.map((img, idx) => (
                <LightboxImage
                  key={idx}
                  src={img}
                  alt={`Thought image ${idx + 1}`}
                />
              ))}
            </div>
          )}

          {/* Divider */}
          <div
            className={cn(
              "mt-12 h-px w-full bg-zinc-100 dark:bg-zinc-800/60",
              index === thoughts.length - 1 && "hidden",
            )}
          />
        </div>
      ))}
    </div>
  );
}
