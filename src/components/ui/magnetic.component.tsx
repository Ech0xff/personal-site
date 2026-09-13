"use client";
import * as stylex from "@stylexjs/stylex";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { motionToken, shape } from "#design/tokens.stylex";

import { useMagnetic } from "./magnetic.hook";

const styles = stylex.create({
  area: {
    position: "relative",
    "::before": {
      content: '""',
      position: "absolute",
      insetInline: `calc(0px - ${motionToken.magneticReachX})`,
      insetBlock: `calc(0px - ${motionToken.magneticReachY})`,
    },
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: shape.touch,
    minWidth: shape.touch,
    gap: "inherit",
  },
  compact: {
    justifyContent: "inherit",
    minHeight: 0,
    minWidth: 0,
    width: "100%",
    height: "100%",
    "::before": { content: "none" },
  },
  content: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "inherit",
    gap: "inherit",
    minHeight: "inherit",
    pointerEvents: "none",
  },
});

// Keep the native link/button outside this component so its hit area never moves.
export function Magnetic({
  children,
  compact = false,
}: Readonly<{ children: ReactNode; compact?: boolean }>) {
  const magnetic = useMagnetic();
  return (
    <span
      {...stylex.props(styles.area, compact && styles.compact)}
      onPointerMove={magnetic.move}
      onPointerLeave={magnetic.reset}
      onPointerCancel={magnetic.reset}
    >
      <motion.span
        {...stylex.props(styles.content)}
        data-magnetic-content=""
        style={{ x: magnetic.x, y: magnetic.y }}
      >
        {children}
      </motion.span>
    </span>
  );
}
