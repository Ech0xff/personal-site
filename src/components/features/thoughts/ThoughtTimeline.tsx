import Stack from "@/components/ui/Stack";
import { cn } from "@/lib/shared/utils";

import ThoughtCard, { type Thought } from "./ThoughtCard";

interface Props {
  thoughts: Thought[];
  locale?: string;
  className?: string;
  renderMetaRight?: (thought: Thought) => React.ReactNode;
  renderActions?: (thought: Thought) => React.ReactNode;
}

export default function ThoughtTimeline({
  thoughts,
  locale,
  renderActions,
  className,
}: Props) {
  return (
    <Stack
      y
      className={cn(
        "my-6 gap-12 border-zinc-200 border-l py-2 pl-6 dark:border-zinc-800",
        className,
      )}
    >
      {thoughts.map((thought, index) => (
        <ThoughtCard
          key={thought.id}
          thought={thought}
          locale={locale}
          index={index + 1}
          isLast={index === thoughts.length - 1}
          renderActions={renderActions}
        />
      ))}
    </Stack>
  );
}
