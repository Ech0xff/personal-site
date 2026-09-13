"use client";

import * as stylex from "@stylexjs/stylex";

import Stack from "#components/ui/stack.component";
import type { StyleInput } from "#design/style.type";
import {
  color,
  font,
  space,
  shape,
  shadow,
  motionToken,
} from "#design/tokens.stylex";
const styles = stylex.create({
  state: {
    paddingTop: "2px",
    paddingRight: "2px",
    paddingBottom: "2px",
    paddingLeft: "2px",
  },
  state2: {
    paddingTop: space.xxs,
    paddingRight: space.xxs,
    paddingBottom: space.xxs,
    paddingLeft: space.xxs,
  },
  state3: {
    paddingLeft: space.xs,
    paddingRight: space.xs,
    paddingTop: "2px",
    paddingBottom: "2px",
    fontSize: font.small,
    lineHeight: 1.5,
  },
  state4: {
    paddingLeft: space.sm,
    paddingRight: space.sm,
    paddingTop: "6px",
    paddingBottom: "6px",
    fontSize: font.control,
    lineHeight: 1.5,
  },
  container: {
    display: "flex",
    width: "min-content",
    alignItems: "center",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    backgroundColor: color.surfaceMuted,
  },
  container2: {
    opacity: 0.6,
  },
  button: {
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    whiteSpace: "nowrap",
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  button2: {
    backgroundColor: color.surfaceSelected,
    color: color.text,
    boxShadow: shadow.subtle,
  },
  button3: {
    color: {
      default: color.muted,
      ":hover": color.secondary,
    },
  },
  button4: {
    pointerEvents: "none",
  },
});
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
  xstyle?: StyleInput;
  buttonStyles?: StyleInput;
}
export default function SegmentedToggle<T extends string>({
  value,
  options,
  onChange,
  size = "md",
  disabled = false,
  xstyle,
  buttonStyles,
}: SegmentedToggleProps<T>) {
  const wrapperSizeStyles = size === "sm" ? styles.state : styles.state2;
  const buttonSizeStyles = size === "sm" ? styles.state3 : styles.state4;
  return (
    <Stack
      xstyle={[
        styles.container,
        wrapperSizeStyles,
        disabled && styles.container2,
        xstyle,
      ]}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            {...stylex.props([
              styles.button,
              buttonSizeStyles,
              isActive ? styles.button2 : styles.button3,
              disabled && styles.button4,
              buttonStyles,
            ])}
            disabled={disabled}
          >
            {option.label}
          </button>
        );
      })}
    </Stack>
  );
}
