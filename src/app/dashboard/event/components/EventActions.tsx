"use client";

import { Edit, Trash2 } from "lucide-react";

import { deleteEvent } from "@/actions";
import { useEditor } from "@/app/dashboard/components/EditorProvider";

interface EventActionsProps {
  eventId: string;
}

export default function EventActions({ eventId }: EventActionsProps) {
  const { openEditor } = useEditor();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    const result = await deleteEvent(eventId);
    if (!result.success) {
      alert(result.error || "Failed to delete event");
    }
  };

  return (
    <>
      <button
        onClick={() => openEditor(eventId)}
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
