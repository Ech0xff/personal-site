import * as stylex from "@stylexjs/stylex";
import { useRef } from "react";

import Button from "#components/ui/button.component";
import { color, font, space } from "#design/tokens.stylex";
import {
  datetimeLocalToUtcIso,
  formatTime,
  toDatetimeLocalValue,
} from "#lib/shared/utils/date.helper";

const styles = stylex.create({
  trigger: {
    paddingInline: space.xs,
    fontSize: font.small,
    fontWeight: font.regular,
    color: { default: color.muted, ":hover": color.accentText },
  },
  field: { position: "relative" },
  picker: {
    position: "absolute",
    inset: 0,
    width: "100%",
    opacity: 0,
    pointerEvents: "none",
  },
});

export default function PublishTime({
  value,
  onChange,
}: Readonly<{ value: string; onChange: (value: string) => void }>) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <span {...stylex.props(styles.field)}>
      <Button
        variant="ghost"
        aria-label={`Published at ${formatTime(value, "MMM D, YYYY, h:mm A")}. Change publish time`}
        xstyle={styles.trigger}
        onClick={() => input.current?.showPicker()}
      >
        <time dateTime={value}>{formatTime(value, "MMM D, YYYY, h:mm A")}</time>
      </Button>
      <input
        ref={input}
        tabIndex={-1}
        aria-label="Publish date and time"
        type="datetime-local"
        value={toDatetimeLocalValue(value)}
        onChange={(event) => {
          if (event.target.value)
            onChange(datetimeLocalToUtcIso(event.target.value));
        }}
        {...stylex.props(styles.picker)}
      />
    </span>
  );
}
