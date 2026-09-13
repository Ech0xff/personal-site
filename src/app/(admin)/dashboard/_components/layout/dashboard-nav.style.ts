import * as stylex from "@stylexjs/stylex";

import { color, font, space } from "#design/tokens.stylex";

export const styles = stylex.create({
  sidebar: {
    display: "flex",
    flexDirection: { default: "column", "@media (max-width: 767px)": "row" },
    alignItems: { default: "stretch", "@media (max-width: 767px)": "center" },
    flexWrap: "wrap",
    flexShrink: 0,
    gap: space.xs,
    width: { default: "176px", "@media (max-width: 767px)": "100%" },
    padding: { default: "12px", "@media (max-width: 767px)": "8px" },
    backgroundColor: color.surfaceMuted,
    borderRightWidth: { default: 1, "@media (max-width: 767px)": 0 },
    borderRightStyle: "solid",
    borderRightColor: color.line,
  },
  header: { display: "flex", alignItems: "center", gap: space.xs },
  back: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    minHeight: "40px",
    minWidth: "32px",
    fontSize: font.large,
    fontWeight: font.semibold,
    color: { default: color.text, ":hover": color.accentText },
  },
  label: {
    display: { default: "inline", "@media (max-width: 767px)": "none" },
  },
  nav: {
    display: "flex",
    flexDirection: { default: "column", "@media (max-width: 767px)": "row" },
    gap: space.xs,
    marginTop: { default: space.xl, "@media (max-width: 767px)": 0 },
  },
  link: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    justifyContent: {
      default: "flex-start",
      "@media (max-width: 767px)": "center",
    },
    minHeight: "44px",
    paddingInline: "10px",
    flexShrink: 0,
    color: { default: color.muted, ":hover": color.accentText },
    fontSize: "16px",
    fontWeight: font.medium,
  },
  current: { color: color.accentText },
  logout: {
    marginTop: { default: "auto", "@media (max-width: 767px)": 0 },
    marginLeft: { default: 0, "@media (max-width: 767px)": "auto" },
    paddingTop: { default: space.lg, "@media (max-width: 767px)": 0 },
  },
});
