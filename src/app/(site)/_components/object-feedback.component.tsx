import * as stylex from "@stylexjs/stylex";

import type { StyleInput } from "#design/style.type";

import { feedback } from "../_design/object-feedback.stylex";
export function ObjectFeedback({
  label,
  round = false,
  xstyle,
}: Readonly<{ label: string; round?: boolean; xstyle?: StyleInput }>) {
  return (
    <span
      aria-hidden="true"
      {...stylex.props(feedback.frame, round && feedback.round, xstyle)}
    >
      <span {...stylex.props(feedback.label)}>{label}</span>
    </span>
  );
}
