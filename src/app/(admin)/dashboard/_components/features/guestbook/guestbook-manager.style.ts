import * as stylex from "@stylexjs/stylex";

import { color, space, shape } from "#design/tokens.stylex";
export const styles = stylex.create({
  root: { padding: space.lg },
  entry: {
    paddingBlock: space.md,
    borderBottomWidth: "1px",
    borderBottomStyle: "solid",
    borderBottomColor: color.line,
  },
  byline: {
    display: "flex",
    flexWrap: "wrap",
    gap: space.sm,
    color: color.muted,
  },
  message: {
    whiteSpace: "pre-wrap",
    overflowWrap: "anywhere",
    marginBlock: space.sm,
  },
  actions: { display: "flex", gap: space.md, paddingBlock: space.sm },
  button: {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: color.line,
    borderRadius: shape.small,
    padding: space.xs,
    backgroundColor: color.surface,
    color: color.text,
  },
});
