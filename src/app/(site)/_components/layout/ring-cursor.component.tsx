"use client";
import * as stylex from "@stylexjs/stylex";
import { motion } from "framer-motion";
import { useRef } from "react";

import { color } from "#design/tokens.stylex";

import { useRingCursor } from "./ring-cursor.hook";

const styles = stylex.create({
  layer: {
    position: "fixed",
    left: 0,
    top: 0,
    right: "auto",
    bottom: "auto",
    width: 0,
    height: 0,
    margin: 0,
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    pointerEvents: "none",
    zIndex: 2147483647,
    overflow: "visible",
    opacity: 0,
    "::backdrop": { backgroundColor: "transparent", pointerEvents: "none" },
  },
  ring: {
    position: "absolute",
    left: "-10px",
    top: "-10px",
    width: "20px",
    height: "20px",
    borderWidth: "1.5px",
    borderStyle: "solid",
    borderColor: color.text,
    boxShadow: `0 0 0 1px ${color.inverse}`,
    borderRadius: "50%",
    backgroundColor: "transparent",
    pointerEvents: "none",
  },
  ripple: { borderColor: color.accent, boxShadow: "none", opacity: 0 },
});

/** A manual popover keeps the cursor above native dialogs without intercepting input. */
export function RingCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y, scale, rotate, rippleScale, rippleOpacity } =
    useRingCursor(ref);
  return (
    <motion.div
      ref={ref}
      popover="manual"
      aria-hidden="true"
      data-ring-layer
      {...stylex.props(styles.layer)}
      style={{ x, y }}
    >
      <motion.span
        data-ring-ripple
        {...stylex.props(styles.ring, styles.ripple)}
        style={{ scale: rippleScale, opacity: rippleOpacity }}
      />
      <motion.span
        data-ring-visual
        {...stylex.props(styles.ring)}
        style={{ scale, rotate }}
      />
    </motion.div>
  );
}
