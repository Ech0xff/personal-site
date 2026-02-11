"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { updateThoughtStatus } from "@/actions";
import SegmentedToggle from "@/app/dashboard/components/ui/SegmentedToggle";
import { Status } from "@/types";

interface StatusToggleProps {
  thoughtId: string;
  status: Status | null;
}

export default function StatusToggle({ thoughtId, status }: StatusToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentStatus: Status = status ?? "hide";

  const handleChange = (nextStatus: Status) => {
    if (nextStatus === currentStatus) return;

    startTransition(async () => {
      const result = await updateThoughtStatus(thoughtId, nextStatus);
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
