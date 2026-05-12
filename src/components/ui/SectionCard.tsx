import type { ComponentPropsWithoutRef } from "react";

import { cn } from "#lib/shared/utils";

import Stack from "./Stack";

interface Props extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  className?: string;
  divide?: boolean;
}

export default function SectionCard({
  children,
  className,
  divide,
  ...props
}: Props) {
  return (
    <Stack
      y
      className={cn(
        "overflow-hidden rounded-xl border border-(--border-default) bg-(--surface-card) *:p-4",
        className,
      )}
      divide={divide}
      {...props}
    >
      {children}
    </Stack>
  );
}
