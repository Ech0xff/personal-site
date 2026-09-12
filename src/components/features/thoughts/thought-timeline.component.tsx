import Stack from "#components/ui/stack.component";
import { cn } from "#lib/shared/utils";

import ThoughtCard, { type Thought } from "./thought-card.component";

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
    <Stack
      y
      className={cn(
        "my-6 gap-12 border-l border-border-default py-2 pl-6 ",
        className,
      )}
    >
      {thoughts.map((thought, index) => (
        <ThoughtCard
          key={thought.id}
          thought={thought}
          id={thought.id}
          index={index + 1}
          isLast={index === thoughts.length - 1}
          renderActions={renderActions}
        />
      ))}
    </Stack>
  );
}
