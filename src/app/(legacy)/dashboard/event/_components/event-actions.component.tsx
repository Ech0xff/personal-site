"use client";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import IconButton from "#components/ui/icon-button.component";
import { deleteEventByBrowser } from "#lib/client/services";

interface EventActionsProps {
  eventId: string;
  openEditor: (id: string | null) => void;
  successCallback?: (eventId: string) => void;
}

export default function EventActions({
  eventId,
  openEditor,
  successCallback,
}: EventActionsProps) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const toastId = toast.loading("Deleting event...");

    try {
      await deleteEventByBrowser(eventId);
      if (successCallback) successCallback(eventId);
      toast.success("Event deleted successfully.", { id: toastId });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete event",
        { id: toastId },
      );
    }
  };

  return (
    <>
      <IconButton
        size="sm"
        onClick={() => openEditor(eventId)}
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
