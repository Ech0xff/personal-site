import Link from "#components/shared/link.component";
import Stack from "#components/ui/stack.component";
import { useDictionary } from "#dictionary";
import { cn } from "#lib/shared/utils";
import { formatTime } from "#lib/shared/utils/date.helper";
import type { Post, Tag } from "#types";

import TagsList from "./tags-list.component";

interface Props {
  post: Post & {
    tags: Tag[];
  };
  className?: string;
}

export default function PostCard({ post, className }: Props) {
  const dictionary = useDictionary();
  const { id, title, published_at } = post;
  return (
    <Link
      href={`/posts/${id}`}
      className={cn(
        "group flex items-center rounded-r-lg border-l-2 border-border-default py-2 pl-6 hover:border-info-border hover:bg-surface-muted  ",
        className,
      )}
    >
      <Stack x className="min-w-0 flex-1">
        {/* Title */}
        <span className="mx-4 min-w-0 truncate whitespace-nowrap">{title}</span>
        <TagsList className="mr-2 hidden sm:flex" tags={post.tags} />
        {/* Date */}
        <span className="ml-auto w-28 shrink-0 text-sm whitespace-nowrap text-text-muted">
          {formatTime(
            published_at,
            "MMM D, YYYY",
            dictionary.common.unknownDate,
          )}
        </span>
      </Stack>
    </Link>
  );
}
