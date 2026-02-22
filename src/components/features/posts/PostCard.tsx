import Link from "@/components/ui/Link";
import Stack from "@/components/ui/Stack";
import { getT } from "@/lib/shared/i18n/tools";
import { cn, formatTime } from "@/lib/shared/utils";

import TagsList from "./TagsList";

export type Post = {
  id: string;
  title: string | null;
  published_at: string | null;
  tags: string[] | null;
};

interface Props {
  post: Post;
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
        "group flex items-center rounded-r-lg border-l-2 border-gray-200 py-2 pl-6 hover:border-blue-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-zinc-900/50",
        className,
      )}
    >
      <Stack x className="flex-1">
        {/* Title */}
        <span className="mx-4">{title}</span>
        <TagsList className="mr-auto hidden sm:flex" tags={post.tags} />
        {/* Date */}
        <span className="ml-auto w-28 text-sm text-gray-400">
          {formatTime(published_at, "MMM D, YYYY", tCommon("unknownDate"))}
        </span>
      </Stack>
    </Link>
  );
}
