"use client";

import { ComponentPropsWithoutRef } from "react";

import { Loader2 } from "lucide-react";

import StackX from "@/components/ui/StackX";
import StackY from "@/components/ui/StackY";
import { cn } from "@/lib/shared/utils";

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
      <StackX className="h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </StackX>
    );
  }

  if (error) {
    return (
      <StackX className="h-full items-center justify-center">
        {errorRender ? (
          errorRender
        ) : (
          <span className="text-zinc-500">
            An error occurred while loading data.
          </span>
        )}
      </StackX>
    );
  }

  return (
    <StackY {...props} className={cn("flex-1 overflow-auto *:p-4", className)}>
      <StackX className="items-center justify-between">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        {optActions && <div>{optActions}</div>}
      </StackX>
      <StackY className="flex-1 overflow-auto">{children}</StackY>
    </StackY>
  );
}
