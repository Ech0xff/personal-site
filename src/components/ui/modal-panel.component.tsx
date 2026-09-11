import type { ComponentPropsWithRef } from "react";

import { cn } from "#lib/shared/utils";
export default function ModalPanel({
  className,
  ...props
}: ComponentPropsWithRef<"div">) {
  return (
    <div
      {...props}
      className={cn(
        "rounded-2xl border border-border-default bg-surface-card text-text-primary shadow-xl",
        className,
      )}
    />
  );
}
