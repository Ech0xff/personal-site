"use client";

import * as stylex from "@stylexjs/stylex";

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
  textGroup: { padding: 0, backgroundColor: "transparent", gap: space.xs },
  textButton: {
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    boxShadow: "none",
    fontSize: font.small,
    color: color.muted,
  },
  textSelected: { color: color.accentText },
  smallGroup: {
    paddingTop: "2px",
    paddingRight: "2px",
    paddingBottom: "2px",
    paddingLeft: "2px",
  },
  mediumGroup: {
    paddingTop: space.xxs,
    paddingRight: space.xxs,
    paddingBottom: space.xxs,
    paddingLeft: space.xxs,
  },
  smallButton: {
    paddingLeft: space.xs,
    paddingRight: space.xs,
    paddingTop: "2px",
    paddingBottom: "2px",
    fontSize: font.small,
    lineHeight: 1.5,
  },
  mediumButton: {
    paddingLeft: space.sm,
    paddingRight: space.sm,
    paddingTop: "6px",
    paddingBottom: "6px",
    fontSize: font.control,
    lineHeight: 1.5,
  },
  group: {
    borderWidth: 0,
    margin: 0,
    minWidth: 0,
    display: "flex",
    width: "min-content",
    alignItems: "center",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    backgroundColor: color.surfaceMuted,
  },
  disabled: {
    opacity: 0.6,
  },
  option: {
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
  selected: {
    backgroundColor: color.accent,
    color: color.onAccent,
    boxShadow: shadow.subtle,
  },
  unselected: {
    color: {
      default: color.muted,
      ":hover": color.secondary,
    },
  },
  nonInteractive: {
    pointerEvents: "none",
  },
});
export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};
interface SegmentedToggleProps<T extends string> {
  value: T;
  options: readonly SegmentedOption<T>[];
  label?: string;
  variant?: "surface" | "text";
  onChange: (value: T) => void;
  size?: "sm" | "md";
  disabled?: boolean;
  xstyle?: StyleInput;
  buttonStyles?: StyleInput;
}
export default function SegmentedToggle<T extends string>({
  value,
  label,
  variant = "surface",
  options,
  onChange,
  size = "md",
  disabled = false,
  xstyle,
  buttonStyles,
}: SegmentedToggleProps<T>) {
  const wrapperSizeStyles =
    size === "sm" ? styles.smallGroup : styles.mediumGroup;
  const buttonSizeStyles =
    size === "sm" ? styles.smallButton : styles.mediumButton;
  return (
    <fieldset
      aria-label={label}
      {...stylex.props([
        styles.group,
        wrapperSizeStyles,
        disabled && styles.disabled,
        variant === "text" && styles.textGroup,
        xstyle,
      ])}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => {
              if (!isActive) onChange(option.value);
            }}
            {...stylex.props([
              styles.option,
              buttonSizeStyles,
              isActive ? styles.selected : styles.unselected,
              disabled && styles.nonInteractive,
              variant === "text" && styles.textButton,
              variant === "text" && isActive && styles.textSelected,
              buttonStyles,
            ])}
            disabled={disabled}
          >
            {option.label}
          </button>
        );
      })}
    </fieldset>
  );
}
