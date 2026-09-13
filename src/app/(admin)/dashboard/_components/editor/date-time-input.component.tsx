"use client";

import * as stylex from "@stylexjs/stylex";
import { CalendarDays } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import Button from "#components/ui/button.component";
import Input from "#components/ui/input.component";
import type { StyleInput } from "#design/style.type";
import {
  datetimeLocalToUtcIso,
  toDatetimeLocalValue,
} from "#lib/shared/utils/date.helper";
type DateTimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  xstyle?: StyleInput;
  buttonStyles?: StyleInput;
  ariaLabel?: string;
  disabled?: boolean;
  fallbackToNow?: boolean;
};
export default function DateTimeInput({
  value,
  onChange,
  xstyle,
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
    <Button
      variant="ghost"
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
      <Input
        ref={dateInputRef}
        value={resolvedValue}
        onChange={(event) =>
          onChange(datetimeLocalToUtcIso(event.target.value, fallbackValue))
        }
        type="datetime-local"
        xstyle={styles.input}
      />
      <CalendarDays {...stylex.props(xstyle)} />
    </Button>
  );
}
const styles = stylex.create({
  input: {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clipPath: "inset(50%)",
    whiteSpace: "nowrap",
    borderWidth: 0,
  },
});
