import { ThoughtMarkdown } from "@/components/markdown";
import LightboxImage from "@/components/ui/Image";
import { cn } from "@/lib/shared/utils";

export interface ThoughtItem {
  id: string;
  content: string;
  images: string[] | null;
  created_at: string | null;
  status?: string | null;
}

interface ThoughtTimelineProps {
  thoughts: ThoughtItem[];
  totalCount?: number;
  renderMetaRight?: (thought: ThoughtItem) => React.ReactNode;
  renderActions?: (thought: ThoughtItem) => React.ReactNode;
}

function formatDateDetail(dateStr: string | null) {
  if (!dateStr) return "Unknown Date";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ThoughtTimeline({
  thoughts,
  totalCount,
  renderMetaRight,
  renderActions,
}: ThoughtTimelineProps) {
  const total = totalCount ?? thoughts.length;

  return (
    <div className="mt-4 space-y-12 border-l border-zinc-200 pt-1 pl-6 dark:border-zinc-800">
      {thoughts.map((thought, index) => (
        <div key={thought.id} className="group">
          {/* Meta Row */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3 font-mono text-xs text-zinc-400 dark:text-zinc-500">
              <span className="font-bold text-zinc-500 dark:text-zinc-400">
                #{total - index}
              </span>
              <span>•</span>
              <span>{formatDateDetail(thought.created_at)}</span>
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
