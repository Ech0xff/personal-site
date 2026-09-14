import * as stylex from "@stylexjs/stylex";

import { color, font, space } from "#design/tokens.stylex";
export const contentStyles = stylex.create({
  title: {
    fontFamily: font.display,
    fontSize: "clamp(36px, 6vw, 56px)",
    fontWeight: font.regular,
    lineHeight: 1.2,
    marginBottom: space.lg,
    overflowWrap: "anywhere",
    outline: "none",
  },
  total: { color: color.text, fontWeight: font.semibold },
  description: { color: color.muted, lineHeight: 1.7, marginBottom: space.xl },
  date: {
    display: "block",
    fontFamily: font.mono,
    fontSize: font.small,
    color: color.muted,
    marginBottom: space.sm,
  },
  body: { lineHeight: 1.8, overflowWrap: "anywhere", minWidth: 0 },
});
