import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";

export interface ThoughtItem {
  id: string;
  content: string;
  images: string[] | null;
  created_at: string | null;
}

interface ThoughtTimelineProps {
  thoughts: ThoughtItem[];
  totalCount?: number;
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
            {renderActions && (
              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                {renderActions(thought)}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="prose prose-zinc dark:prose-invert mb-4 max-w-none text-base leading-relaxed text-zinc-800 dark:text-zinc-200">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {thought.content}
            </ReactMarkdown>
          </div>

          {/* Images Grid */}
          {thought.images && thought.images.length > 0 && (
            <div
              className={`mt-4 grid gap-2 ${
                thought.images.length === 1
                  ? "max-w-md grid-cols-1"
                  : "grid-cols-2 md:grid-cols-3"
              }`}
            >
              {thought.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-4/3 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 dark:border-zinc-700/50 dark:bg-zinc-800"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Thought image ${idx + 1}`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
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
