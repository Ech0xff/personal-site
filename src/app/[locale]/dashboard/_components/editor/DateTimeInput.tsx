"use client";

import { CalendarDays } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import {
  datetimeLocalToUtcIso,
  toDatetimeLocalValue,
} from "@/lib/shared/utils";

type DateTimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  ariaLabel?: string;
  disabled?: boolean;
  fallbackToNow?: boolean;
};

export default function DateTimeInput({
  value,
  onChange,
  className,
  ariaLabel = "Select published time",
  disabled,
  fallbackToNow = true,
}: DateTimeInputProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const fallbackNowUtc = useMemo(() => new Date().toISOString(), []);
  const fallbackValue = fallbackToNow ? fallbackNowUtc : "";
  const resolvedValue = toDatetimeLocalValue(value || fallbackValue);

  useEffect(() => {
    if (fallbackToNow && !value) {
      onChange(fallbackNowUtc);
    }
  }, [fallbackNowUtc, fallbackToNow, onChange, value]);

  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={() => {
        const input = dateInputRef.current;
        if (!input) return;
        if (typeof input.showPicker === "function") {
          input.showPicker();
          return;
        }
        input.click();
      }}
    >
      <input
        ref={dateInputRef}
        value={resolvedValue}
        onChange={(event) =>
          onChange(datetimeLocalToUtcIso(event.target.value, fallbackValue))
        }
        type="datetime-local"
        className="sr-only"
      />
      <CalendarDays className={className} />
    </button>
  );
}
