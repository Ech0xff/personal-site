"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Edit, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useEditor } from "@/app/dashboard/components/EditorProvider";
import { deletePostByBrowser } from "@/lib/client/services";

interface PostActionsProps {
  postId: string;
}

export default function PostActions({ postId }: PostActionsProps) {
  const { openEditor } = useEditor();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const toastId = toast.loading("Deleting post...");

    try {
      await deletePostByBrowser(postId);
      toast.success("Post deleted successfully.", { id: toastId });
      router.refresh();
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
        onClick={() => openEditor(postId)}
        className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        onClick={handleDelete}
        className="rounded p-1.5 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </>
  );
}
