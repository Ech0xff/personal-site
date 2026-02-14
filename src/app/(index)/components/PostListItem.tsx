import Link from "next/link";

import { formatTime } from "@/lib/shared/utils";

interface PostListItemProps {
  id: string;
  title: string;
  publishedAt?: string | null;
}

export default function PostListItem({
  id,
  title,
  publishedAt,
}: PostListItemProps) {
  return (
    <Link
      href={`/posts/${id}`}
      className="group flex items-center rounded-r-lg border-l-2 border-gray-200 py-2 pl-6 hover:border-blue-500 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-zinc-900/50"
    >
      {/* Title */}
      <span className="mx-4 flex-1">{title}</span>
      {/* Date */}
      <span className="w-28 shrink-0 text-sm text-gray-400">
        {publishedAt ? formatTime(publishedAt, "MMM D, YYYY", "Unknown Date") : "Unknown Date"}
      </span>
    </Link>
  );
}
