import * as stylex from "@stylexjs/stylex";

import { color, font, media, motionToken, space } from "#design/tokens.stylex";

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
  list: { listStyleType: "none", margin: 0, padding: 0 },
  row: {
    display: "grid",
    width: "100%",
    gridTemplateColumns: {
      default: "12px minmax(0, 1fr) auto",
      [media.phone]: "12px minmax(0, 1fr)",
    },
    alignItems: "baseline",
    columnGap: space.sm,
    rowGap: 0,
    paddingBlock: 0,
    paddingInline: space.xs,
    minHeight: { default: 0, [media.phone]: "44px" },
    backgroundColor: {
      default: "transparent",
      ":hover": color.surfaceMuted,
      ":focus-visible": color.surfaceMuted,
      ":active": color.surfaceStrong,
    },
    transitionProperty: "background-color",
    transitionDuration: { default: motionToken.fast, [media.reduce]: "0s" },
    fontSize: { default: font.large, [media.phone]: font.bodySize },
    lineHeight: 1.6,
  },
  dash: {
    alignSelf: "start",
    width: "12px",
    height: "1px",
    backgroundColor: color.muted,
    marginTop: "0.8em",
  },
  link: { minWidth: 0, color: color.text, overflowWrap: "anywhere" },
  date: {
    gridColumn: { default: "3", [media.phone]: "2" },
    fontSize: { default: font.bodySize, [media.phone]: font.small },
    color: color.muted,
    whiteSpace: "nowrap",
    lineHeight: 1.6,
  },
});
