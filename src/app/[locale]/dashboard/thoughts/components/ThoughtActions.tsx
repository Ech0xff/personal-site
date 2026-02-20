"use client";

import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteThoughtByBrowser } from "@/lib/client/services";
import { useEditor } from "../../components/EditorProvider";

interface ThoughtActionsProps {
  thoughtId: string;
  successCallback?: (thoughtId: string) => void;
}

export default function ThoughtActions({
  thoughtId,
  successCallback,
}: ThoughtActionsProps) {
  const { openEditor } = useEditor();

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
      <button
        onClick={() => openEditor(thoughtId)}
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
