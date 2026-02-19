import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/shared/utils";

interface Props extends ComponentPropsWithoutRef<"div"> {
  x?: true;
  y?: true;
  
  divide?: true;
  children?: React.ReactNode;
  className?: string;
}

export default function Stack({
  x,
  y,
  divide,
  children,
  className,
  ...props
}: Props) {
  const layoutClass = x ? "flex flex-row" : y ? "flex flex-col" : "block";
  const divideClass = divide ? (x ? "divide-x" : "divide-y") : "";
  return (
    <div
      className={cn(
        "divide-zinc-200 dark:divide-zinc-800 border-zinc-200 dark:border-zinc-800",
        divideClass,
        layoutClass,
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
