import * as stylex from "@stylexjs/stylex";
import { Link as LinkIcon } from "lucide-react";

import type { StyleInput } from "#design/style.type";

import { feedback } from "../_design/object-feedback.stylex";
export function ObjectFeedback({
  label,
  navigable = false,
  round = false,
  xstyle,
}: Readonly<{
  label: string;
  navigable?: boolean;
  round?: boolean;
  xstyle?: StyleInput;
}>) {
  return (
    <span
      aria-hidden="true"
      {...stylex.props(feedback.frame, round && feedback.round, xstyle)}
    >
      <span {...stylex.props(feedback.label)}>
        {label}
        {navigable && (
          <>
            {" "}
            <LinkIcon size={11} aria-hidden />
          </>
        )}
      </span>
    </span>
  );
}
