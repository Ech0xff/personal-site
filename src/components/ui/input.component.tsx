import type { ComponentPropsWithRef } from "react";

import { cn } from "#lib/shared/utils";
const sizes = {
  sm: "h-8 text-xs",
  md: "h-10 text-sm",
  lg: "h-12 text-base",
} as const;
interface Props extends ComponentPropsWithRef<"input"> {
  controlSize?: keyof typeof sizes;
  invalid?: boolean;
}
export default function Input({
  controlSize = "md",
  invalid,
  className,
  ...props
}: Props) {
  return (
    <input
      {...props}
      aria-invalid={invalid || props["aria-invalid"]}
      className={cn(
        "min-w-0 rounded-lg border border-border-default bg-surface-input px-3 text-text-primary transition-colors placeholder:text-text-placeholder read-only:bg-surface-muted focus-visible:border-focus-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger-border aria-invalid:outline-danger-text",
        sizes[controlSize],
        className,
      )}
    />
  );
}
