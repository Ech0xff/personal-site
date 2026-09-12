"use client";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import IconButton from "#components/ui/icon-button.component";
import { deleteThoughtByBrowser } from "#lib/client/services";

interface ThoughtActionsProps {
  thoughtId: string;
  openEditor: (id: string | null) => void;
  successCallback?: (thoughtId: string) => void;
}

export default function ThoughtActions({
  thoughtId,
  openEditor,
  successCallback,
}: ThoughtActionsProps) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this thought?")) return;
    const toastId = toast.loading("Deleting thought...");

    try {
      await deleteThoughtByBrowser(thoughtId);
      if (successCallback) successCallback(thoughtId);
      toast.success("Thought deleted successfully.", { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete thought",
        { id: toastId },
      );
    }
  };

  return (
    <>
      <IconButton
        size="sm"
        onClick={() => openEditor(thoughtId)}
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
