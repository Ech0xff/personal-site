import { LoaderCircle } from "lucide-react";
import type { ComponentPropsWithRef } from "react";

import { cn } from "#lib/shared/utils";

const variants = {
  primary:
    "border-transparent bg-primary-bg text-primary-fg hover:bg-primary-hover",
  secondary:
    "border-border-default bg-surface-panel text-text-primary hover:bg-surface-hover",
  ghost:
    "border-transparent bg-transparent text-text-secondary hover:bg-surface-hover",
  danger:
    "border-danger-border bg-danger-bg text-danger-text hover:bg-danger-border/30",
} as const;
const sizes = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
} as const;
export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
}
export default function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {loading && (
        <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
      )}
      {children}
    </button>
  );
}
