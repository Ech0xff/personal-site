import ThoughtContent from "#components/features/content/thought-content.component";
import Image from "#components/ui/image.component";
import Stack from "#components/ui/stack.component";
import { useDictionary } from "#dictionary";
import { formatMessage } from "#lib/shared/dictionary/dictionary.helper";
import { formatTime } from "#lib/shared/utils/date.helper";
import { cn } from "#lib/shared/utils/tailwind.helper";
import type { Status } from "#types";

export type Thought = {
  id: string;
  content: string;
  images: string[];
  status: Status;
  published_at: string;
};

interface Props {
  thought: Thought;
  id?: string;
  className?: string;
  index?: number;
  isLast?: boolean;
  renderActions?: (thought: Thought) => React.ReactNode;
}

export default function ThoughtCard({
  thought,
  id,
  className,
  index,
  isLast = true,
  renderActions,
}: Props) {
  const dictionary = useDictionary();

  return (
    <div id={id} className={cn("group scroll-mt-24", className)}>
      {/* Meta Row */}
      <Stack x className="items-center justify-between">
        <Stack x className="gap-3 font-mono text-xs text-text-muted">
          <span className="font-bold text-text-muted">
            #{index ? index : dictionary.thoughtCard.preview}
          </span>
          <span>•</span>
          <span>
            {formatTime(
              thought.published_at,
              "MM/DD, HH:mm",
              dictionary.common.unknownDate,
            )}
          </span>
        </Stack>
        <Stack x className="items-center gap-2">
          {renderActions?.(thought)}
        </Stack>
      </Stack>
      {/* Content */}
      <ThoughtContent content={thought.content} />
      {/* Images Grid */}
      {thought.images.length > 0 && (
        <div
          className={cn(
            "mt-4 grid gap-2",
            "grid-cols-6 gap-2 md:grid-cols-8 lg:grid-cols-10",
          )}
        >
          {thought.images.map((img, idx) => (
            <Image
              key={img}
              framed
              src={img}
              alt={formatMessage(dictionary.thoughtCard.imageAlt, {
                index: idx + 1,
              })}
            />
          ))}
        </div>
      )}
      {/* Divider */}
      {!isLast && <div className="mt-12 h-px w-full bg-border-default" />}
    </div>
  );
}
