"use client";

import { useTransition } from "react";

import { toast } from "sonner";

import { updateEventStatusByBrowser } from "@/lib/client/services";
import { Status } from "@/types";

import SegmentedToggle from "../../components/ui/SegmentedToggle";

interface StatusToggleProps {
  eventId: string;
  status: Status;
  successCallback?: (eventId: string, nextStatus: Status) => void;
}

export default function StatusToggle({
  eventId,
  status,
  successCallback,
}: StatusToggleProps) {
  const [isPending, startTransition] = useTransition();
  const currentStatus: Status = status;

  const handleChange = (nextStatus: Status) => {
    if (nextStatus === currentStatus) return;

    startTransition(async () => {
      const toastId = toast.loading("Updating status...");
      try {
        await updateEventStatusByBrowser(eventId, nextStatus);
        if (successCallback) successCallback(eventId, nextStatus);
        toast.success("Status updated successfully.", { id: toastId });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to update status",
          { id: toastId },
        );
      }
    });
  };

  return (
    <SegmentedToggle
      value={currentStatus}
      onChange={handleChange}
      options={[
        { value: "hide", label: "Hide" },
        { value: "show", label: "Show" },
      ]}
      size="sm"
      disabled={isPending}
    />
  );
}
