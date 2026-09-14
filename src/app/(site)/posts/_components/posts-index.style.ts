import * as stylex from "@stylexjs/stylex";

import {
  color,
  font,
  media,
  motionToken,
  shape,
  space,
} from "#design/tokens.stylex";

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
    padding: 0,
  },
  row: {
    display: "grid",
    width: "100%",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    alignItems: "center",
    columnGap: space.sm,
    rowGap: 0,
    paddingBlock: 0,
    paddingLeft: { default: space.lg, [media.phone]: space.sm },
    paddingRight: space.xs,
    borderLeftWidth: shape.fine,
    borderLeftStyle: "solid",
    borderLeftColor: {
      default: color.line,
      ":hover": color.accent,
      ":focus-visible": color.accent,
      ":active": color.accent,
    },
    minHeight: shape.touch,
    backgroundColor: {
      default: "transparent",
      ":hover": color.surfaceMuted,
      ":focus-visible": color.surfaceMuted,
      ":active": color.surfaceStrong,
    },
    transitionProperty: "background-color, border-color",
    transitionDuration: { default: motionToken.fast, [media.reduce]: "0s" },
    fontSize: { default: font.navigation, [media.phone]: font.control },
    lineHeight: 1.6,
  },
  link: {
    minWidth: 0,
    color: color.text,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  date: {
    gridColumn: "2",
    fontSize: { default: font.control, [media.phone]: font.small },
    color: color.muted,
    whiteSpace: "nowrap",
    lineHeight: 1.6,
  },
});
