import { cn } from "@/lib/shared/utils";

import ThoughtCard, { Thought } from "./ThoughtCard";

interface ThoughtTimelineProps {
  thoughts: Thought[];
  totalCount?: number;
  className?: string;
  renderMetaRight?: (thought: Thought) => React.ReactNode;
  renderActions?: (thought: Thought) => React.ReactNode;
}

export default function ThoughtTimeline({
  thoughts,
  totalCount,
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
        <ThoughtCard
          key={thought.id}
          thought={thought}
          index={index + 1}
          isLast={index === thoughts.length - 1}
          renderActions={renderActions}
        />
      ))}
    </div>
  );
}
