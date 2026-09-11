import Stack from "#components/ui/stack.component";
import { cn } from "#lib/shared/utils/tailwind.helper";
import type { Tag } from "#types";

export default function TagsList({
  tags,
  maxVisible = 3,
  className,
}: {
  tags?: Tag[];
  maxVisible?: number;
  className?: string;
}) {
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisible);
  const hiddenTags = tags.slice(maxVisible);
  const hasMore = hiddenTags.length > 0;

  return (
    <Stack x className={cn("flex-nowrap items-center gap-1", className)}>
      {visibleTags.map((tag) => (
        <div
          key={tag.id}
          className="shrink-0 rounded bg-surface-muted px-1.5 py-0.5 text-xs whitespace-nowrap text-text-secondary"
        >
          {tag.name}
        </div>
      ))}
      {hasMore && (
        <div className="group/tooltip relative shrink-0">
          <div className="cursor-default rounded bg-surface-hover-strong px-1.5 py-0.5 text-xs whitespace-nowrap text-text-muted">
            +{hiddenTags.length}
          </div>
          <div className="pointer-events-none invisible absolute bottom-full left-1/2 z-(--layer-tooltip) mb-2 -translate-x-1/2 rounded-lg bg-surface-inverse px-3 py-2 text-xs whitespace-nowrap text-text-inverse opacity-0 shadow-lg transition group-focus-within/tooltip:visible group-focus-within/tooltip:opacity-100 group-hover/tooltip:visible group-hover/tooltip:opacity-100">
            {hiddenTags.map((tag) => tag.name).join(", ")}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-700" />
          </div>
        </div>
      )}
    </Stack>
  );
}
