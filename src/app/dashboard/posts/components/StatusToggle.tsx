"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import SegmentedToggle from "@/app/dashboard/components/ui/SegmentedToggle";
import { updatePostStatusByBrowser } from "@/lib/client/services";
import { Status } from "@/types";

interface StatusToggleProps {
  postId: string;
  status: Status | null;
}

export default function StatusToggle({ postId, status }: StatusToggleProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentStatus: Status = status ?? "hide";

  const handleChange = (nextStatus: Status) => {
    if (nextStatus === currentStatus) return;

    startTransition(async () => {
      try {
        await updatePostStatusByBrowser(postId, nextStatus);
        router.refresh();
      } catch (error) {
        alert(
          error instanceof Error ? error.message : "Failed to update status",
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
