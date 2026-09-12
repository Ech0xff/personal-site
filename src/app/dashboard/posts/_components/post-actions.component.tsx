"use client";
import { Edit, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import Link from "#components/shared/link.component";
import IconButton from "#components/ui/icon-button.component";
import { deletePostByBrowser } from "#lib/client/services";

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
        className="rounded p-1.5 text-text-muted transition-colors hover:bg-surface-muted hover:text-text-secondary"
        title="View"
      >
        <Eye className="h-4 w-4" />
      </Link>
      <IconButton
        size="sm"
        onClick={() => openEditor(postId)}
        title="Edit"
        aria-label="Edit"
      >
        <Edit className="h-4 w-4" />
      </IconButton>
      <IconButton
        size="sm"
        className="text-text-muted hover:bg-danger-bg hover:text-danger-text"
        onClick={handleDelete}
        title="Delete"
        aria-label="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </IconButton>
    </>
  );
}
