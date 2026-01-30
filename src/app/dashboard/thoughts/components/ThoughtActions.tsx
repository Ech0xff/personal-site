"use client";

import { Edit, Trash2 } from "lucide-react";

import { deleteThought } from "../actions";
import { useEditor } from "./EditorProvider";

interface ThoughtActionsProps {
  thoughtId: string;
}

export default function ThoughtActions({ thoughtId }: ThoughtActionsProps) {
  const { openEditor } = useEditor();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this thought?")) return;

    const result = await deleteThought(thoughtId);
    if (!result.success) {
      alert(result.error || "Failed to delete thought");
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
