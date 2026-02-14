"use client";

import { CalendarDays } from "lucide-react";
import { useRef } from "react";

type DateTimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  triggerOnly?: boolean;
  triggerClassName?: string;
  triggerLabel?: string;
};

export default function DateTimeInput({
  value,
  onChange,
  label = "Published Time",
  wrapperClassName,
  labelClassName,
  inputClassName,
  triggerOnly = false,
  triggerClassName,
  triggerLabel = "Select published time",
}: DateTimeInputProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

  if (triggerOnly) {
    return (
      <div className={wrapperClassName}>
        <input
          ref={dateInputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type="datetime-local"
          className="sr-only"
        />
        <button
          type="button"
          aria-label={triggerLabel}
          title={triggerLabel}
          onClick={() => {
            const input = dateInputRef.current;
            if (!input) return;
            if (typeof input.showPicker === "function") {
              input.showPicker();
              return;
            }
            input.click();
          }}
          className={
            triggerClassName ||
            "inline-flex h-9 w-9 items-center justify-center rounded border border-zinc-200 text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:text-zinc-100"
          }
        >
          <CalendarDays className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <label
        className={
          labelClassName ||
          "mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        }
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          type="datetime-local"
          className={
            inputClassName ||
            "w-full rounded-lg border border-zinc-200 bg-transparent px-4 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
          }
        />
      </div>
    </div>
  );
}
