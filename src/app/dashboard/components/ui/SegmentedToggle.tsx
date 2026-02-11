"use client";

import { cn } from "@/lib/shared/utils";

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
    <div
      className={cn(
        "flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800",
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
              "rounded-md transition-all",
              buttonSizeClass,
              isActive
                ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
              disabled && "pointer-events-none",
              buttonClassName,
            )}
            disabled={disabled}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
