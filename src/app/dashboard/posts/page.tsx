import Link from "next/link";

import { QueryData } from "@supabase/supabase-js";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

import HeaderSection from "../components/HeaderSection";

function StatusBadge({ status }: { status: string | null }) {
  const styles = {
    published:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    hidden:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  };
  const statusKey = (status || "hidden") as keyof typeof styles;
  return (
    <span
      className={cn(
        "rounded-full px-2 py-0.5 text-xs font-medium",
        styles[statusKey] || styles.hidden,
      )}
    >
      {status || "None"}
    </span>
  );
}

function TagsList({
  tags,
  maxVisible = 3,
}: {
  tags: string[] | null;
  maxVisible?: number;
}) {
  if (!tags || tags.length === 0) return null;

  const visibleTags = tags.slice(0, maxVisible);
  const hiddenTags = tags.slice(maxVisible);
  const hasMore = hiddenTags.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-1">
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
    </div>
  );
}

interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "right" | "center";
  render: (item: T) => React.ReactNode;
}

function Table<T>({
  data,
  columns,
  emptyMessage = "No data available",
  keyExtractor,
}: {
  data: T[] | null;
  columns: Column<T>[];
  emptyMessage?: string;
  keyExtractor: (item: T) => string;
}) {
  const getAlignClass = (align?: "left" | "right" | "center") => {
    switch (align) {
      case "right":
        return "text-right";
      case "center":
        return "text-center";
      default:
        return "text-left";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-6 py-3 text-xs font-medium tracking-wider whitespace-nowrap text-zinc-500 uppercase dark:text-zinc-400",
                  getAlignClass(col.align),
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {data && data.length > 0 ? (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn("px-6 py-4", getAlignClass(col.align))}
                  >
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default async function PostsPage() {
  const postsQuery = supabase.from("posts").select("*");
  const { data: posts, error } = await postsQuery.order("created_at", {
    ascending: false,
  });
  type Post = QueryData<typeof postsQuery>[number];
  if (error) {
    console.error("Error fetching posts:", error);
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns: Column<Post>[] = [
    {
      key: "title",
      header: "Title",
      render: (post) => (
        <div className="font-medium text-zinc-900 dark:text-zinc-100">
          {post.title}
        </div>
      ),
    },
    {
      key: "tags",
      header: "Tags",
      render: (post) => <TagsList tags={post.tags} maxVisible={3} />,
    },
    {
      key: "status",
      header: "Status",
      render: (post) => <StatusBadge status={post.status} />,
    },
    {
      key: "views",
      header: "Views",
      render: (post) => (
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {post.view_count || 0}
        </span>
      ),
    },
    {
      key: "created",
      header: "Created",
      render: (post) => (
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {formatDate(post.created_at)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (post) => (
        <div className="flex items-center justify-end gap-2">
          <Link
            href={`/posts/${post.id}`}
            className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            title="View"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            href={`/dashboard/posts/${post.id}`}
            className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <HeaderSection title="Posts">
        <Link
          href="/dashboard/posts/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </HeaderSection>

      {/* Posts Table */}
      <Table
        data={posts}
        columns={columns}
        keyExtractor={(post) => post.id}
        emptyMessage="No posts yet. Create your first post!"
      />
    </div>
  );
}
