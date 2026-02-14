import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/shared/utils";

import StackY from "./StackY";

interface Props extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  className?: string;
  divided?: boolean;
}

export default function SectionCard({
  children,
  className,
  divided,
  ...props
}: Props) {
  return (
    <StackY
      className={cn(
        "overflow-hidden rounded-xl border border-zinc-200 bg-white *:p-4 dark:border-zinc-800 dark:bg-zinc-900",
        className,
      )}
      divided={divided}
      {...props}
    >
      {children}
    </StackY>
  );
}
