import type { ComponentPropsWithoutRef } from "react";

import { cn } from "#lib/shared/utils";

interface Props extends ComponentPropsWithoutRef<"div"> {
  x?: boolean;
  y?: boolean;

  divide?: boolean;
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
        "divide-(--border-default) border-(--border-default)",
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
