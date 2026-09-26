import * as stylex from "@stylexjs/stylex";

import {
  color,
  font,
  media,
  motionToken,
  shape,
  space,
} from "#design/tokens.stylex";

export const signature = stylex.defineMarker();
export const recordMarker = stylex.defineMarker();
export const objectMarker = stylex.defineMarker();
export const feedback = stylex.create({
  frame: {
    position: "absolute",
    inset: "-14px",
    pointerEvents: "none",
    opacity: {
      default: 0,
      [media.touch]: 1,
      [stylex.when.ancestor(":hover", objectMarker)]: 1,
      [stylex.when.ancestor(
        ":is(:focus-visible, :has(:focus-visible))",
        objectMarker,
      )]: 1,
    },
    transition: `opacity ${motionToken.normal} ease`,
    zIndex: motionToken.tooltip,
  },
  label: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.xxs,
    position: "absolute",
    left: "50%",
    top: 0,
    transform: {
      default: "translate(-50%, calc(-50% + 7px))",
      [media.touch]: "translate(-50%, -50%)",
      [stylex.when.ancestor(":hover", objectMarker)]: "translate(-50%, -50%)",
      [stylex.when.ancestor(
        ":is(:focus-visible, :has(:focus-visible))",
        objectMarker,
      )]: "translate(-50%, -50%)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.normal, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
    width: "max-content",
    maxWidth: "240px",
    paddingBlock: space.xxs,
    paddingInline: space.sm,
    borderRadius: shape.pill,
    backgroundColor: color.objectLabelBackground,
    zIndex: 1,
    color: color.objectLabel,
    fontFamily: font.mono,
    fontSize: font.small,
    fontWeight: font.bold,
    lineHeight: 1.5,
    textAlign: "center",
    textShadow: "none",
    letterSpacing: "0.02em",
  },
});
