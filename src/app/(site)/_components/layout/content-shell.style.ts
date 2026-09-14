import * as stylex from "@stylexjs/stylex";

import { media, shape, space } from "#design/tokens.stylex";

export const contentShellStyles = stylex.create({
  root: {
    width: "100%",
    maxWidth: shape.reading,
    marginInline: "auto",
    paddingInline: { default: space.lg, [media.phone]: "40px" },
    paddingBlock: space.xxl,
  },
});
