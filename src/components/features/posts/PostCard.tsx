import Link from "@/components/ui/Link";
import Stack from "@/components/ui/Stack";
import { getT } from "@/lib/shared/i18n/tools";
import { cn, formatTime } from "@/lib/shared/utils";
import type { Post, Tag } from "@/types";

import TagsList from "./TagsList";

interface Props {
  post: Post & {
    tags: Tag[];
  };
  className?: string;
  locale?: string;
}

export default function PostCard({ post, className, locale }: Props) {
  const tCommon = getT("Common", locale);
  const { id, title, published_at } = post;
  return (
    <Link
      href={`/posts/${id}`}
      className={cn(
        "group flex items-center rounded-r-lg border-gray-200 border-l-2 py-2 pl-6 hover:border-blue-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-zinc-900/50",
        className,
      )}
    >
      <Stack x className="min-w-0 flex-1">
        {/* Title */}
        <span className="mx-4 min-w-0 truncate whitespace-nowrap">{title}</span>
        <TagsList className="mr-2 hidden sm:flex" tags={post.tags} />
        {/* Date */}
        <span className="ml-auto w-28 shrink-0 whitespace-nowrap text-gray-400 text-sm">
          {formatTime(published_at, "MMM D, YYYY", tCommon("unknownDate"))}
        </span>
      </Stack>
    </Link>
  );
}
