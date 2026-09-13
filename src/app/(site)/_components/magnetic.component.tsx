"use client";
import * as stylex from "@stylexjs/stylex";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { motionToken, shape } from "#design/tokens.stylex";

import { useMagnetic } from "./use-magnetic.hook";

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
  content: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "inherit",
    minHeight: "inherit",
    pointerEvents: "none",
  },
});

// Keep the native link/button outside this component so its hit area never moves.
export function Magnetic({ children }: Readonly<{ children: ReactNode }>) {
  const magnetic = useMagnetic();
  return (
    <span
      {...stylex.props(styles.area)}
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
