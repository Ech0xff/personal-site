"use client";

import { Edit, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import Link from "@/components/ui/Link";
import { deletePostByBrowser } from "@/lib/client/services";

interface PostActionsProps {
  postId: string;
  openEditor: (id: string | null) => void;
  successCallback?: (postId: string) => void;
}

export default function PostActions({
  postId,
  openEditor,
  successCallback,
}: PostActionsProps) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const toastId = toast.loading("Deleting post...");

    try {
      await deletePostByBrowser(postId);
      if (successCallback) successCallback(postId);
      toast.success("Post deleted successfully.", { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post",
        { id: toastId },
      );
    }
  };

  return (
    <>
      <Link
        href={`/posts/${postId}`}
        className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        title="View"
      >
        <Eye className="h-4 w-4" />
      </Link>
      <button
        type="button"
        onClick={() => openEditor(postId)}
        className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={handleDelete}
        className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </>
  );
}
