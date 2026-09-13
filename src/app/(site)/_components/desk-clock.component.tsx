"use client";
import * as stylex from "@stylexjs/stylex";

import { font, motionToken, shape, space } from "#design/tokens.stylex";

import { foundation } from "../_design/foundation.style";
import { material } from "../_design/tokens.stylex";
import { useClock } from "./use-clock.hook";

const styles = stylex.create({
  root: {
    position: "absolute",
    left: space.sm,
    bottom: space.xxs,
  },
  button: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    padding: 0,
    minHeight: shape.touch,
    borderWidth: 0,
    borderStyle: "solid",
    backgroundColor: "transparent",
    color: {
      default: material.phosphor,
      ":hover": material.phosphor,
      ":focus-visible": material.phosphor,
    },
    opacity: { default: 0.7, ":hover": 1, ":focus-visible": 1 },
    fontFamily: font.mono,
    fontSize: font.small,
    fontVariantNumeric: "tabular-nums",
    transition: `opacity ${motionToken.normal} ease`,
  },
  time: {
    display: "inline-block",
    width: "11ch",
    textAlign: "left",
    whiteSpace: "nowrap",
  },
});
export function DeskClock() {
  const clock = useClock();
  const action = `Switch to ${clock.format === "24h" ? "12" : "24"}-hour time`;
  return (
    <div {...stylex.props(styles.root)}>
      <button
        type="button"
        {...stylex.props(styles.button, foundation.focus)}
        onClick={clock.toggle}
        aria-label={`Local time ${clock.text}. ${action}`}
        data-clock-format={clock.format}
      >
        <time {...stylex.props(styles.time)}>{clock.text}</time>
      </button>
    </div>
  );
}
