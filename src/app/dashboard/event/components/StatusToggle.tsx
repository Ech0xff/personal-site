"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import SegmentedToggle from "@/app/dashboard/components/SegmentedToggle";
import { Status } from "@/types";

import { updateEventStatus } from "../actions";

interface StatusToggleProps {
  eventId: string;
  status: Status | null;
}

export default function StatusToggle({ eventId, status }: StatusToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentStatus: Status = status ?? "hide";

  const handleChange = (nextStatus: Status) => {
    if (nextStatus === currentStatus) return;

    startTransition(async () => {
      const result = await updateEventStatus(eventId, nextStatus);
      if (!result.success) {
        alert(result.error || "Failed to update status");
        return;
      }
      router.refresh();
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
