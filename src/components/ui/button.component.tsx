import * as stylex from "@stylexjs/stylex";
import { LoaderCircle } from "lucide-react";
import type { ComponentPropsWithRef } from "react";

import type { StyleInput } from "#design/style.type";
import { font, space, shape, motionToken, color } from "#design/tokens.stylex";
const spin = stylex.keyframes({
  to: {
    rotate: "360deg",
  },
});
const styles = stylex.create({
  primary: {
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    backgroundColor: {
      default: color.accent,
      ":hover": color.accentHover,
    },
    color: color.onAccent,
  },
  secondary: {
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: {
      default: color.surface,
      ":hover": color.surfaceHover,
    },
    color: color.text,
  },
  ghost: {
    borderTopColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
    backgroundColor: {
      default: "transparent",
      ":hover": color.surfaceHover,
    },
    color: color.secondary,
  },
  danger: {
    borderTopColor: color.dangerBorder,
    borderRightColor: color.dangerBorder,
    borderBottomColor: color.dangerBorder,
    borderLeftColor: color.dangerBorder,
    backgroundColor: {
      default: color.dangerSurface,
      ":hover": `color-mix(in srgb, ${color.dangerBorder} 30%, transparent)`,
    },
    color: color.dangerText,
  },
  sm: {
    height: space.xl,
    paddingLeft: space.sm,
    paddingRight: space.sm,
    fontSize: font.small,
    lineHeight: 1.5,
  },
  md: {
    height: "40px",
    paddingLeft: space.md,
    paddingRight: space.md,
    fontSize: font.control,
    lineHeight: 1.5,
  },
  lg: {
    height: space.xxl,
    paddingLeft: "20px",
    paddingRight: "20px",
    fontSize: font.bodySize,
    lineHeight: 1.5,
  },
  button: {
    display: "inline-flex",
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
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
    fontWeight: font.medium,
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    pointerEvents: {
      default: null,
      ":disabled": "none",
    },
    opacity: {
      default: null,
      ":disabled": 0.5,
    },
  },
  icon: {
    width: space.md,
    height: space.md,
    animationName: spin,
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
});
const variants = {
  primary: styles.primary,
  secondary: styles.secondary,
  ghost: styles.ghost,
  danger: styles.danger,
} as const;
const sizes = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
} as const;
export interface ButtonProps extends ComponentPropsWithRef<"button"> {
  xstyle?: StyleInput;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  loading?: boolean;
}
export default function Button({
  children,
  xstyle,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...stylex.props([styles.button, variants[variant], sizes[size], xstyle])}
    >
      {loading && (
        <LoaderCircle aria-hidden="true" {...stylex.props(styles.icon)} />
      )}
      {children}
    </button>
  );
}
