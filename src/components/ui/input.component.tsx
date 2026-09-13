import * as stylex from "@stylexjs/stylex";
import type { ComponentPropsWithRef } from "react";

import type { StyleInput } from "#design/style.type";
import { color, font, motionToken, shape } from "#design/tokens.stylex";

const styles = stylex.create({
  field: { display: "block", position: "relative", minWidth: 0, width: "100%" },
  input: {
    width: "100%",
    minWidth: 0,
    borderWidth: 0,
    borderRadius: shape.control,
    paddingInline: "14px",
    color: color.text,
    backgroundColor: {
      default: color.surfaceMuted,
      ":focus": color.surfaceHover,
    },
    outlineStyle: "none",
    boxShadow: {
      default: "none",
      ":focus-visible": `inset 0 -2px ${color.focus}`,
      ':is([aria-invalid="true"])': `inset 0 -2px ${color.dangerText}`,
    },
    transitionProperty: "background-color, box-shadow",
    transitionDuration: motionToken.fast,
    opacity: { default: 1, ":disabled": 0.5 },
    cursor: { default: null, ":disabled": "not-allowed" },
  },
  sm: { height: "36px", fontSize: font.small },
  md: { height: "44px", fontSize: font.control },
  lg: { height: "48px", fontSize: font.bodySize },
  floating: {
    height: "58px",
    paddingTop: "21px",
    paddingBottom: "7px",
    fontSize: font.bodySize,
  },
  label: {
    position: "absolute",
    insetInlineStart: "14px",
    top: "18px",
    lineHeight: "22px",
    fontSize: font.bodySize,
    color: color.muted,
    pointerEvents: "none",
    transformOrigin: "left top",
    transform: {
      default: "translateY(0) scale(1)",
      ":is(input:focus + *, input:not(:placeholder-shown) + *)":
        "translateY(-11px) scale(0.75)",
    },
    transitionProperty: "transform, color",
    transitionDuration: motionToken.fast,
  },
  raised: { transform: "translateY(-11px) scale(0.75)" },
});
const sizes = { sm: styles.sm, md: styles.md, lg: styles.lg } as const;
interface Props extends ComponentPropsWithRef<"input"> {
  xstyle?: StyleInput;
  controlSize?: keyof typeof sizes;
  invalid?: boolean;
  label?: string;
}
export default function Input({
  controlSize = "md",
  invalid,
  xstyle,
  label,
  ...props
}: Props) {
  const control = (
    <input
      {...props}
      placeholder={label ? " " : props.placeholder}
      aria-invalid={invalid || props["aria-invalid"]}
      {...stylex.props(
        styles.input,
        sizes[controlSize],
        Boolean(label) && styles.floating,
        xstyle,
      )}
    />
  );
  if (!label) return control;
  const raised = ["date", "datetime-local", "time", "color"].includes(
    props.type ?? "text",
  );
  return (
    <label {...stylex.props(styles.field)}>
      {control}
      <span {...stylex.props(styles.label, raised && styles.raised)}>
        {label}
      </span>
    </label>
  );
}
