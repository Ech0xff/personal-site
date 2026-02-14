import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/shared/utils";

interface Props extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode;
  className?: string;
  divided?: boolean;
}

export default function StackX({
  children,
  className,
  divided,
  ...props
}: Props) {
  return (
    <div
      className={cn("flex", className, {
        "divide-x divide-zinc-200 dark:divide-zinc-800": divided,
      })}
      {...props}
    >
      {children}
    </div>
  );
}
