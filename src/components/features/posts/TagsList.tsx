import { cn } from "@/lib/shared/utils/tailwind";

import StackX from "../../ui/StackX";

export default function TagsList({
  tags,
  maxVisible = 3,
  className,
}: {
  tags: string[] | null;
  maxVisible?: number;
  className?: string;
}) {
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisible);
  const hiddenTags = tags.slice(maxVisible);
  const hasMore = hiddenTags.length > 0;

  return (
    <StackX className={cn("flex-wrap items-center gap-1", className)}>
      {visibleTags.map((tag) => (
        <div
          key={tag}
          className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
        >
          {tag}
        </div>
      ))}
      {hasMore && (
        <div className="group/tooltip relative">
          <div className="cursor-default rounded bg-zinc-200 px-1.5 py-0.5 text-xs text-zinc-500 dark:bg-zinc-700 dark:text-zinc-400">
            +{hiddenTags.length}
          </div>
          <div className="pointer-events-none invisible absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 rounded-lg bg-zinc-900 px-3 py-2 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-all group-hover/tooltip:visible group-hover/tooltip:opacity-100 dark:bg-zinc-700">
            {hiddenTags.join(", ")}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-700" />
          </div>
        </div>
      )}
    </StackX>
  );
}
