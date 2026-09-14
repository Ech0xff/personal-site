import * as stylex from "@stylexjs/stylex";
import { LoaderCircle } from "lucide-react";

import type { StyleInput } from "#design/style.type";
import { color, font, media, space } from "#design/tokens.stylex";

const spin = stylex.keyframes({ to: { transform: "rotate(360deg)" } });
const styles = stylex.create({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: space.sm,
    flex: "1",
    width: "100%",
    minHeight: "240px",
    color: color.muted,
    fontSize: font.control,
  },
  compact: { minHeight: "120px" },
  inherit: { color: "inherit" },
  spinner: {
    width: "24px",
    height: "24px",
    color: color.accent,
    willChange: "transform",
    animationName: spin,
    animationDuration: "900ms",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationPlayState: { default: "running", [media.reduce]: "paused" },
  },
});
export default function Loading({
  compact = false,
  tone = "default",
  xstyle,
}: Readonly<{
  compact?: boolean;
  tone?: "default" | "inherit";
  xstyle?: StyleInput;
}>) {
  return (
    <output
      aria-live="polite"
      {...stylex.props(
        styles.root,
        compact && styles.compact,
        tone === "inherit" && styles.inherit,
        xstyle,
      )}
    >
      <span
        aria-hidden
        {...stylex.props(styles.spinner, tone === "inherit" && styles.inherit)}
      >
        <LoaderCircle size={24} />
      </span>
      <span>Loading…</span>
    </output>
  );
}
