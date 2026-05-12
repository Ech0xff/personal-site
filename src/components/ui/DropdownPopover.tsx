import React, { useId } from "react";

import { cn } from "#lib/shared/utils";

import Stack from "./Stack";

interface Props {
  trigger: React.ReactElement<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "button"
  >;
  children: React.ReactNode;
  popoverClassName?: string;
  className?: string;
}

export default function DropdownPopover({
  trigger,
  children,
  className,
  popoverClassName,
}: Props) {
  const uniqueId = useId().replace(/:/g, "");
  const popoverId = `popover-${uniqueId}`;
  const anchorName = `--anchor-${uniqueId}`;

  const clonedTrigger = React.cloneElement(trigger, {
    popoverTarget: popoverId,
    style: {
      ...trigger.props.style,
      anchorName: anchorName,
    },
  });

  return (
    <Stack x className={cn("relative items-center", className)}>
      {clonedTrigger}
      <Stack
        id={popoverId}
        popover="auto"
        className={cn(
          "pointer-events-none fixed z-10 mt-2 flex -translate-x-1/2 scale-50 flex-col items-center rounded-md border border-(--border-default) bg-(--surface-card) px-2 py-1 text-(--text-secondary) opacity-0 shadow-sm duration-200",
          "open:pointer-events-auto open:scale-100 open:opacity-100",
          popoverClassName,
        )}
        style={{
          positionAnchor: anchorName,
          inset: `anchor(bottom) auto auto anchor(center)`,
        }}
      >
        {children}
      </Stack>
    </Stack>
  );
}
