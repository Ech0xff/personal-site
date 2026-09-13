import * as stylex from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";

import type { StyleInput } from "#design/style.type";
import { color, space, shape, motionToken, font } from "#design/tokens.stylex";
const styles = stylex.create({
  sm: {
    height: space.xl,
    fontSize: font.small,
    lineHeight: 1.5,
  },
  md: {
    height: "40px",
    fontSize: font.control,
    lineHeight: 1.5,
  },
  lg: {
    height: space.xxl,
    fontSize: font.bodySize,
    lineHeight: 1.5,
  },
  input: {
    minWidth: "0px",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: {
      default: color.line,
      ":focus-visible": color.focus,
      ':is([aria-invalid="true"])': color.dangerBorder,
    },
    borderRightColor: {
      default: color.line,
      ":focus-visible": color.focus,
      ':is([aria-invalid="true"])': color.dangerBorder,
    },
    borderBottomColor: {
      default: color.line,
      ":focus-visible": color.focus,
      ':is([aria-invalid="true"])': color.dangerBorder,
    },
    borderLeftColor: {
      default: color.line,
      ":focus-visible": color.focus,
      ':is([aria-invalid="true"])': color.dangerBorder,
    },
    backgroundColor: {
      default: color.input,
      ":read-only": color.surfaceMuted,
    },
    paddingLeft: space.sm,
    paddingRight: space.sm,
    color: {
      default: color.text,
      "::placeholder": color.placeholder,
    },
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    cursor: {
      default: null,
      ":disabled": "not-allowed",
    },
    opacity: {
      default: null,
      ":disabled": 0.5,
    },
    outlineColor: {
      default: null,
      ':is([aria-invalid="true"])': color.dangerText,
    },
  },
});
const sizes = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
} as const;
interface Props extends ComponentPropsWithRef<"input"> {
  xstyle?: StyleInput;
  controlSize?: keyof typeof sizes;
  invalid?: boolean;
}
export default function Input({
  controlSize = "md",
  invalid,
  xstyle,
  ...props
}: Props) {
  return (
    <input
      {...props}
      aria-invalid={invalid || props["aria-invalid"]}
      {...stylex.props([styles.input, sizes[controlSize], xstyle])}
    />
  );
}
