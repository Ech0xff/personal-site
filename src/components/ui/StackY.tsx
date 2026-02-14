import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/shared/utils";

interface Props extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  className?: string;
  divided?: boolean;
}

export default function StackY({
  children,
  className,
  divided,
  ...props
}: Props) {
  return (
    <div
      className={cn("flex flex-col", className, {
        "divide-y divide-zinc-200 dark:divide-zinc-800": divided,
      })}
      {...props}
    >
      {children}
    </div>
  );
}
