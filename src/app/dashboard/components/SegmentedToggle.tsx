"use client";

import { cn } from "@/lib/utils";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

interface SegmentedToggleProps<T extends string> {
  value: T;
  options: SegmentedOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  buttonClassName?: string;
}

export default function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  className,
  buttonClassName,
}: SegmentedToggleProps<T>) {
  return (
    <div
      className={cn(
        "flex items-center rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800",
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
              "rounded-md px-3 py-1.5 text-sm transition-all",
              isActive
                ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300",
              buttonClassName,
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
