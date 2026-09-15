import * as stylex from "@stylexjs/stylex";

import {
  color,
  font,
  media,
  motionToken,
  shadow,
  shape,
  material,
} from "#design/tokens.stylex";

import { objectMarker } from "../../_design/object-feedback.stylex";

export const styles = stylex.create({
  calendar: {
    borderRadius: shape.small,
    position: "relative",
    width: "125px",
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
  calendarPaper: {
    transformOrigin: "50% 0%",
    transform: {
      default: "perspective(500px) rotateX(0deg)",
      [stylex.when.ancestor(":hover", objectMarker)]:
        "perspective(500px) rotateX(-9deg)",
      [stylex.when.ancestor(":focus-visible", objectMarker)]:
        "perspective(500px) rotateX(-9deg)",
      [media.reduce]: "perspective(500px) rotateX(0deg)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    backgroundColor: color.surface,
    borderRadius: shape.small,
    boxShadow: shadow.lifted,
    borderBottomWidth: "5px",
    borderBottomStyle: "double",
    borderBottomColor: `${material.paperEdge}`,
    overflow: "hidden",
  },
  calendarTop: {
    backgroundColor: material.bookBack,
    color: color.inverse,
    paddingTop: "14px",
    paddingRight: "8px",
    paddingBottom: "8px",
    paddingLeft: "8px",
    fontFamily: font.mono,
    fontSize: "8px",
    letterSpacing: "0.17em",
  },
  calendarMonth: {
    paddingTop: "14px",
    fontFamily: font.mono,
    fontSize: "8px",
    letterSpacing: "0.12em",
    color: color.muted,
  },
  calendarDate: {
    fontFamily: font.display,
    fontSize: "56px",
    lineHeight: 1.25,
    position: "relative",
  },
  calendarBottom: {
    fontFamily: font.display,
    fontStyle: "italic",
    fontSize: "11px",
    color: color.muted,
    paddingBottom: "17px",
  },
  rings: {
    position: "absolute",
    top: "-5px",
    left: "26px",
    right: "26px",
    display: "flex",
    justifyContent: "space-between",
    zIndex: 1,
  },
  ring: {
    display: "block",
    width: "5px",
    height: "17px",
    borderRadius: "4px",
    backgroundColor: material.binding,
    boxShadow: shadow.metal,
  },
});
