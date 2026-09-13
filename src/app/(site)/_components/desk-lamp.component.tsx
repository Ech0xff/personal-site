import * as stylex from "@stylexjs/stylex";

import { objectMarker } from "../_design/object-feedback.stylex";
import {
  color,
  font,
  space,
  shape,
  light,
  material,
  media,
  motionToken,
} from "../_design/tokens.stylex";

const styles = stylex.create({
  cord: {
    position: "absolute",
    left: "calc(50% - 2px)",
    top: `calc(0px - ${shape.header})`,
    width: "4px",
    height: {
      default: `calc(${shape.header} + 40px)`,
      [media.compact]: `calc(${shape.header} + 50px)`,
    },
    backgroundColor: color.text,
    pointerEvents: "none",
  },
  button: {
    position: "absolute",
    top: { default: "30px", [media.compact]: "40px" },
    left: "50%",
    transform: "translateX(-50%)",
    width: "120px",
    height: "80px",
    padding: 0,
    borderWidth: 0,
    borderStyle: "solid",
    backgroundColor: "transparent",
    pointerEvents: "none",
    outline: "none",
    zIndex: motionToken.tooltip,
  },
  drawing: {
    width: "100%",
    height: "100%",
    overflow: "visible",
    transformOrigin: "50% 0%",
    transform: {
      default: "rotate(0deg)",
      [stylex.when.ancestor(":hover", objectMarker)]: "rotate(-3deg)",
      [stylex.when.ancestor(":focus-visible", objectMarker)]: "rotate(-3deg)",
      [media.reduce]: "rotate(0deg)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
  shade: { fill: material.lamp, pointerEvents: "visiblePainted" },
  neck: { fill: material.lampShade, pointerEvents: "visiblePainted" },
  bulb: {
    fill: material.bulb,
    opacity: light.bulbOpacity,
    pointerEvents: "visiblePainted",
    transition: `opacity ${motionToken.slow} ease`,
  },
  highlight: { fill: material.highlight, pointerEvents: "none" },
  hint: {
    position: "absolute",
    right: "calc(100% + 12px)",
    top: "50%",
    width: "max-content",
    maxWidth: "calc(50vw - 76px)",
    paddingBlock: space.xs,
    paddingInline: space.sm,
    backgroundColor: "transparent",
    color: color.text,
    fontFamily: font.mono,
    fontSize: { default: font.small, [media.phone]: font.tiny },
    lineHeight: 1.5,
    textAlign: "center",
    pointerEvents: "none",
    opacity: {
      default: 0,
      [stylex.when.ancestor(":hover", objectMarker)]: 1,
      [stylex.when.ancestor(":focus-visible", objectMarker)]: 1,
    },
    transform: {
      default: "translate(8px, -50%)",
      [stylex.when.ancestor(":hover", objectMarker)]: "translate(0, -50%)",
      [stylex.when.ancestor(":focus-visible", objectMarker)]:
        "translate(0, -50%)",
      [media.reduce]: "translate(0, -50%)",
    },
    transitionProperty: "opacity, transform",
    transitionDuration: { default: motionToken.normal, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
});
export function DeskLamp({
  on,
  toggle,
}: Readonly<{ on: boolean; toggle: () => void }>) {
  return (
    <>
      <span {...stylex.props(styles.cord)} aria-hidden="true" />
      <button
        type="button"
        aria-label={on ? "Turn desk lamp off" : "Turn desk lamp on"}
        aria-pressed={on}
        onClick={toggle}
        {...stylex.props(styles.button, objectMarker)}
      >
        <svg
          viewBox="0 0 120 80"
          aria-hidden="true"
          {...stylex.props(styles.drawing)}
        >
          <ellipse
            cx="60"
            cy="65"
            rx="18"
            ry="12"
            {...stylex.props(styles.bulb)}
          />
          <path
            d="M49 15 V8 Q49 2 55 2 H65 Q71 2 71 8 V15Z"
            {...stylex.props(styles.neck)}
          />
          <path
            d="M3 62 C4 31 27 12 60 12 C93 12 116 31 117 62 Q117 66 112 66 H8 Q3 66 3 62Z"
            {...stylex.props(styles.shade)}
          />
          <path
            d="M13 55 C17 28 38 17 60 17 C37 23 26 38 24 55Z"
            {...stylex.props(styles.highlight)}
          />
        </svg>
        <span {...stylex.props(styles.hint)} aria-hidden="true">
          Click to turn {on ? "off" : "on"}
        </span>
      </button>
    </>
  );
}
