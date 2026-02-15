import LightboxImage from "@/components/ui/Image";
import StackX from "@/components/ui/StackX";
import ThoughtMarkdown from "@/components/ui/markdown/ThoughtMarkdown";
import { cn } from "@/lib/shared/utils/tailwind";
import { formatTime } from "@/lib/shared/utils/tools";

export type Thought = {
  id: string;
  content: string;
  images: string[];
  status: string;
  published_at: string;
};

interface Props {
  thought: Thought;
  className?: string;
  index?: number;
  isLast?: boolean;
  renderActions?: (thought: Thought) => React.ReactNode;
}

export default function ThoughtCard({
  thought,
  className,
  index,
  isLast = true,
  renderActions,
}: Props) {
  return (
    <div className={cn("group", className)}>
      {/* Meta Row */}
      <StackX className="items-center justify-between">
        <StackX className="gap-3 font-mono text-xs text-zinc-400 dark:text-zinc-500">
          <span className="font-bold text-zinc-500 dark:text-zinc-400">
            #{index ? index : "preview"}
          </span>
          <span>•</span>
          <span>
            {formatTime(thought.published_at, "MM/DD, HH:mm", "Unknown Date")}
          </span>
        </StackX>

        <StackX className="items-center gap-2">
          {renderActions && renderActions(thought)}
        </StackX>
      </StackX>

      {/* Content */}
      <ThoughtMarkdown content={thought.content} />

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
      {!isLast && (
        <div className="mt-12 h-px w-full bg-zinc-100 dark:bg-zinc-800/60" />
      )}
    </div>
  );
}
