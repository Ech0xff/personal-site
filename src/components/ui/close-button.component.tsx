import * as stylex from "@stylexjs/stylex";
import { X } from "lucide-react";

import { media, motionToken } from "#design/tokens.stylex";

import type { ButtonProps } from "./button.component";
import IconButton from "./icon-button.component";

const styles = stylex.create({
  button: { position: "relative", borderRadius: "50%" },
  ring: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    rotate: "-90deg",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
  },
  cross: {
    rotate: {
      default: "0deg",
      ":is(button:hover *, button:focus-visible *)": "180deg",
    },
    transitionProperty: "rotate",
    transitionDuration: { default: "500ms", [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
  circle: {
    opacity: { default: 0, ":is(button:hover *, button:focus-visible *)": 1 },
    strokeDasharray: 1,
    strokeDashoffset: {
      default: 1,
      ":is(button:hover *, button:focus-visible *)": 0,
    },
    transitionProperty: "stroke-dashoffset",
    transitionDuration: { default: "500ms", [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
});

export default function CloseButton({ xstyle, ...props }: ButtonProps) {
  return (
    <IconButton
      magnetic={false}
      aria-label="Close"
      {...props}
      xstyle={[styles.button, xstyle]}
    >
      <svg viewBox="0 0 40 40" aria-hidden {...stylex.props(styles.ring)}>
        <circle
          cx="20"
          cy="20"
          r="18"
          pathLength="1"
          {...stylex.props(styles.circle)}
        />
      </svg>
      <X size={20} aria-hidden {...stylex.props(styles.cross)} />
    </IconButton>
  );
}
