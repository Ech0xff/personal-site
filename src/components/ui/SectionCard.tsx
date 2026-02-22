import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/shared/utils";

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
    <Stack y
      className={cn(
        "overflow-hidden rounded-xl border border-zinc-200 bg-white *:p-4 dark:border-zinc-800 dark:bg-zinc-900",
        className,
      )}
      divide={divide}
      {...props}
    >
      {children}
    </Stack>
  );
}
