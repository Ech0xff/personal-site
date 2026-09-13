"use client";

import * as stylex from "@stylexjs/stylex";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import IconButton from "#components/ui/icon-button.component";
import { color, space } from "#design/tokens.stylex";
import { deleteEventByBrowser } from "#lib/client/services";
const styles = stylex.create({
  icon: {
    height: space.md,
    width: space.md,
  },
  icon2: {
    color: {
      default: color.muted,
      ":hover": color.dangerText,
    },
    backgroundColor: {
      default: null,
      ":hover": color.dangerSurface,
    },
  },
});
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
      toast.success("Event deleted successfully.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete event",
        {
          id: toastId,
        },
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
        <Edit {...stylex.props(styles.icon)} />
      </IconButton>
      <IconButton
        size="sm"
        xstyle={styles.icon2}
        onClick={handleDelete}
        title="Delete"
        aria-label="Delete"
      >
        <Trash2 {...stylex.props(styles.icon)} />
      </IconButton>
    </>
  );
}
