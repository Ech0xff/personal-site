"use client";
import { Loader2 } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";

import { MODAL_ANCHOR } from "#components/ui/modal.const";
import Stack from "#components/ui/stack.component";
import { cn } from "#lib/shared/utils";

interface Props extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  errorRender?: React.ReactNode;
  optActions?: React.ReactNode;
  className?: string;
  loading?: boolean;
  error?: boolean;
  title: string;
}

export default function DashboardShell({
  children,
  className,
  title,
  optActions,
  loading = false,
  error = false,
  errorRender,
  ...props
}: Props) {
  if (loading) {
    return (
      <Stack x className="flex-1 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-text-muted" />
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack x className="flex-1 items-center justify-center">
        {errorRender ? (
          errorRender
        ) : (
          <span className="text-text-muted">
            An error occurred while loading data.
          </span>
        )}
      </Stack>
    );
  }

  return (
    <Stack
      y
      {...props}
      style={{ anchorName: MODAL_ANCHOR.DASHBOARD }}
      className={cn("relative flex-1 overflow-hidden *:p-4", className)}
    >
      <Stack x className="items-center justify-between">
        <h2 className="text-2xl font-bold text-text-primary">{title}</h2>
        {optActions && <div>{optActions}</div>}
      </Stack>
      <Stack y className="flex-1 overflow-auto">
        {children}
      </Stack>
    </Stack>
  );
}
