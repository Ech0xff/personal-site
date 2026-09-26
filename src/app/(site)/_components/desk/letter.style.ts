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
    bottom: "-5px",
    backgroundColor: material.paperEdge,
    transform: {
      default: "rotate(2deg)",
      [stylex.when.ancestor(":hover", objectMarker)]:
        "translate(4px, 2px) rotate(4deg)",
      [stylex.when.ancestor(":focus-visible", objectMarker)]:
        "translate(4px, 2px) rotate(4deg)",
      [media.reduce]: "rotate(2deg)",
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
    minHeight: {
      default: "220px",
      [media.deskShort]: "180px",
      [media.deskCompact]: "240px",
    },
    padding: {
      default: "22px",
      [media.deskShort]: "18px",
      [media.deskCompact]: "26px",
    },
    backgroundColor: color.surface,
    backgroundImage: material.ruledPaper,
    boxShadow: shadow.lifted,
  },
  letterHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontFamily: font.mono,
    fontSize: "7px",
    color: color.muted,
    letterSpacing: "0.06em",
    marginBottom: {
      default: "20px",
      [media.deskShort]: "12px",
      [media.deskCompact]: "26px",
    },
  },
  letterCopy: {
    whiteSpace: "pre-line",
    fontFamily: font.handwritten,
    fontSize: {
      default: "24px",
      [media.deskShort]: "22px",
      [media.deskCompact]: "27px",
    },
    lineHeight: 1.3,
    overflowWrap: "anywhere",
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
