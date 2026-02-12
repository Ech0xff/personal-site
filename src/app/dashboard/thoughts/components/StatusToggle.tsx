"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import SegmentedToggle from "@/app/dashboard/components/ui/SegmentedToggle";
import { updateThoughtStatusByBrowser } from "@/lib/client/services";
import { Status } from "@/types";
import { toast } from "sonner";

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
      const toastId = toast.loading("Updating status...");
      try {
        await updateThoughtStatusByBrowser(thoughtId, nextStatus);
        toast.success("Status updated successfully.", { id: toastId });
        router.refresh();
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
