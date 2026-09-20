import * as stylex from "@stylexjs/stylex";

import { color, font, space } from "#design/tokens.stylex";
export const feedStyles = stylex.create({
  entryActions: { display: "flex", alignItems: "center", gap: space.sm },
  feed: {
    borderLeftWidth: 1,
    borderLeftStyle: "solid",
    borderLeftColor: color.line,
    paddingLeft: { default: space.lg, "@media (max-width: 767px)": space.sm },
    marginTop: space.lg,
  },
  thought: {
    paddingBlock: space.md,
    borderBottomWidth: { default: 1, ":last-child": 0 },
    borderBottomStyle: "solid",
    borderBottomColor: color.line,
  },
  entryHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: space.sm,
    marginBottom: space.sm,
  },
  timestamp: { fontFamily: font.mono, fontSize: "12px", color: color.muted },
  body: {
    color: color.secondary,
    lineHeight: 1.8,
    overflowWrap: "anywhere",
    minWidth: 0,
  },
});
