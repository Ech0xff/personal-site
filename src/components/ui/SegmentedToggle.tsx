"use client";

import Stack from "#components/ui/Stack";
import { cn } from "#lib/shared/utils";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

interface SegmentedToggleProps<T extends string> {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  size?: "sm" | "md";
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
}

export default function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  size = "md",
  disabled = false,
  className,
  buttonClassName,
}: SegmentedToggleProps<T>) {
  const wrapperSizeClass = size === "sm" ? "p-0.5" : "p-1";
  const buttonSizeClass =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1.5 text-sm";
  return (
    <Stack
      className={cn(
        "flex w-min items-center rounded-lg bg-(--surface-muted)",
        wrapperSizeClass,
        disabled && "opacity-60",
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-md whitespace-nowrap transition-all",
              buttonSizeClass,
              isActive
                ? "bg-(--surface-selected) text-(--text-primary) shadow"
                : "text-(--text-muted) hover:text-(--text-secondary)",
              disabled && "pointer-events-none",
              buttonClassName,
            )}
            disabled={disabled}
          >
            {option.label}
          </button>
        );
      })}
    </Stack>
  );
}
