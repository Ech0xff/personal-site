import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

interface Props extends ComponentPropsWithoutRef<"button"> {
  children: React.ReactNode;
  className?: string;
}
export default function Button({ children, className, ...props }: Props) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700",
        className,
      )}
    >
      {children}
    </button>
  );
}
