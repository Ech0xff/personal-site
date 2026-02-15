import StackY from "@/components/ui/StackY";
import { cn } from "@/lib/shared/utils";

import ThoughtCard, { Thought } from "./ThoughtCard";

interface Props {
  thoughts: Thought[];
  className?: string;
  renderMetaRight?: (thought: Thought) => React.ReactNode;
  renderActions?: (thought: Thought) => React.ReactNode;
}

export default function ThoughtTimeline({
  thoughts,
  renderActions,
  className,
}: Props) {
  return (
    <StackY
      className={cn(
        "my-6 gap-12 border-l border-zinc-200 py-2 pl-6 dark:border-zinc-800",
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
    </StackY>
  );
}
