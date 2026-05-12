"use client";

import { useTransition } from "react";

import { toast } from "sonner";

import SegmentedToggle from "#components/ui/SegmentedToggle";
import type { Status } from "#types";

interface StatusToggleProps {
  status: Status;
  onChange: (nextStatus: Status) => Promise<void> | void;
  disabled?: boolean;
}

export default function StatusToggle({
  status,
  onChange,
  disabled,
}: StatusToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextStatus: Status) => {
    if (nextStatus === status) return;

    startTransition(async () => {
      const toastId = toast.loading("Updating status...");
      try {
        await onChange(nextStatus);
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
      value={status}
      onChange={handleChange}
      options={[
        { value: "hide", label: "Hide" },
        { value: "show", label: "Show" },
      ]}
      size="sm"
      disabled={disabled || isPending}
    />
  );
}
