"use client";

import { useEffect, useMemo, useRef } from "react";

import { CalendarDays } from "lucide-react";

import Button from "@/components/ui/Button";
import { datetimeLocalToUtcIso, toDatetimeLocalValue } from "@/lib/shared/utils";

type DateTimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  ariaLabel?: string;
  disabled?: boolean;
};

export default function DateTimeInput({
  value,
  onChange,
  className,
  ariaLabel = "Select published time",
  disabled,
}: DateTimeInputProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const fallbackNowUtc = useMemo(() => new Date().toISOString(), []);
  const resolvedValue = toDatetimeLocalValue(value || fallbackNowUtc);

  useEffect(() => {
    if (!value) {
      onChange(fallbackNowUtc);
    }
  }, [fallbackNowUtc, onChange, value]);

  return (
    <Button
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
      className={className}
    >
      <input
        ref={dateInputRef}
        value={resolvedValue}
        onChange={(event) =>
          onChange(datetimeLocalToUtcIso(event.target.value, fallbackNowUtc))
        }
        type="datetime-local"
        className="sr-only"
      />
      <CalendarDays className="h-4 w-4" />
      Time
    </Button>
  );
}
