import * as stylex from "@stylexjs/stylex";

import { color, font, media, space } from "#design/tokens.stylex";

export const postsStyles = stylex.create({
  title: {
    fontFamily: font.body,
    fontWeight: font.bold,
    fontSize: "clamp(36px, 5vw, 48px)",
  },
  summary: {
    color: color.muted,
    fontSize: font.bodySize,
    lineHeight: 1.8,
    marginBottom: space.lg,
  },
  total: { color: color.text, fontWeight: font.semibold },
  years: { display: "flex", flexDirection: "column", gap: space.xl },
  heading: {
    display: "flex",
    gap: space.sm,
    alignItems: "baseline",
    fontSize: font.heading,
    fontWeight: font.bold,
    marginBottom: space.md,
  },
  count: {
    color: color.muted,
    fontSize: font.bodySize,
    fontWeight: font.regular,
  },
  list: {
    listStyleType: "none",
    margin: 0,
    paddingBlock: 0,
    paddingLeft: { default: space.xl, [media.phone]: space.md },
    paddingRight: 0,
    borderLeftWidth: "2px",
    borderLeftStyle: "solid",
    borderLeftColor: color.line,
  },
  row: {
    display: "grid",
    gridTemplateColumns: {
      default: "minmax(0, 1fr) auto",
      [media.phone]: "minmax(0, 1fr)",
    },
    alignItems: "baseline",
    columnGap: space.xl,
    rowGap: space.xxs,
    paddingBlock: space.sm,
  },
  link: {
    minWidth: 0,
    width: "fit-content",
    maxWidth: "100%",
    fontSize: { default: font.large, [media.phone]: font.bodySize },
    lineHeight: 1.6,
    color: { default: color.text, ":hover": color.accentText },
    overflowWrap: "anywhere",
  },
  date: {
    fontSize: { default: font.bodySize, [media.phone]: font.small },
    color: color.muted,
    whiteSpace: "nowrap",
    lineHeight: 1.6,
  },
});
