import * as stylex from "@stylexjs/stylex";

import {
  color,
  font,
  media,
  motionToken,
  shadow,
  material,
} from "#design/tokens.stylex";

import { objectMarker } from "../../_design/object-feedback.stylex";

export const styles = stylex.create({
  letterFrame: { inset: "-23px" },
  letter: {
    position: "relative",
    width: "100%",
    paddingBottom: "4px",
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
  letterUnder: {
    position: "absolute",
    top: "9px",
    left: "5px",
    width: "100%",
    height: "230px",
    backgroundColor: material.paperEdge,
    transform: {
      default: "rotate(7deg)",
      [stylex.when.ancestor(":hover", objectMarker)]:
        "translate(4px, 2px) rotate(10deg)",
      [stylex.when.ancestor(":focus-visible", objectMarker)]:
        "translate(4px, 2px) rotate(10deg)",
      [media.reduce]: "rotate(7deg)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
    boxShadow: shadow.contact,
  },
  letterSheet: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "240px",
    padding: "26px",
    backgroundColor: color.surface,
    backgroundImage: material.ruledPaper,
    transform: "rotate(3deg)",
    boxShadow: shadow.lifted,
  },
  letterHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: font.mono,
    fontSize: "7px",
    color: color.muted,
    letterSpacing: "0.06em",
    marginBottom: "26px",
  },
  letterCopy: {
    whiteSpace: "pre-line",
    fontFamily: font.handwritten,
    fontSize: {
      default: "clamp(22px, 1.9cqw, 27px)",
      [media.deskCompact]: "27px",
    },
    lineHeight: 1.3,
    color: color.text,
  },
  signature: {
    marginTop: "18px",
    fontFamily: font.mono,
    fontSize: "8px",
    color: color.muted,
  },
  clip: {
    position: "absolute",
    top: "-17px",
    right: "38px",
    width: "15px",
    height: "48px",
    borderWidth: "2px",
    borderStyle: "solid",
    borderColor: material.metal,
    borderRadius: "10px",
    boxShadow: shadow.detail,
    transform: "rotate(12deg)",
  },
});
