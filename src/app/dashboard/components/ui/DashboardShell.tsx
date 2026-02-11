"use client";

import { ComponentPropsWithoutRef } from "react";

import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

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
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  if(error) {
    return (
      <div className="flex h-full items-center justify-center">
        {errorRender ? errorRender : <span className="text-zinc-500">An error occurred while loading data.</span>}
      </div>
    );
  }

  return (
    <div {...props} className={cn("space-y-8 relative", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {title}
          </h2>
        </div>
        {optActions && <div>{optActions}</div>}
      </div>
      {children}
    </div>
  );
}
