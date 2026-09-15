import * as stylex from "@stylexjs/stylex";

import { color } from "#design/tokens.stylex";
export const fieldStyles = stylex.create({
  emphasized: {
    backgroundColor: color.surfaceHover,
    boxShadow: `inset 0 -2px ${color.focus}`,
  },
  invalid: { boxShadow: `inset 0 -2px ${color.dangerText}` },
});
