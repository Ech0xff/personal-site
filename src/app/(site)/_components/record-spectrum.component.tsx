import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, type RefObject } from "react";

import { color, media } from "../_design/tokens.stylex";
import { sampleSpectrum } from "./record-spectrum.helper";
import { useRecordSpectrum } from "./use-record-spectrum.hook";

const spokes = Array.from({ length: 96 }, (_, index) => {
  const angle = (index / 96) * Math.PI * 2;
  return { x: Math.cos(angle), y: Math.sin(angle) };
});
const styles = stylex.create({
  root: {
    position: "absolute",
    inset: "-13%",
    width: "126%",
    height: "126%",
    pointerEvents: "none",
    overflow: "visible",
    color: color.accent,
    display: { default: "block", [media.reduce]: "none" },
  },
  wave: {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    opacity: 0.85,
  },
});

export function RecordSpectrum({
  audioRef,
  playing,
  src,
}: Readonly<{
  audioRef: RefObject<HTMLAudioElement | null>;
  playing: boolean;
  src: string;
}>) {
  const data = useRecordSpectrum(src);
  const pathRef = useRef<SVGPathElement>(null);
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    path.setAttribute("d", "");
    if (!playing || !data) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const draw = () => {
      if (preference.matches || document.hidden) {
        path.setAttribute("d", "");
        return;
      }
      if (audioRef.current?.muted || audioRef.current?.volume === 0) {
        path.setAttribute("d", "");
        frame = requestAnimationFrame(draw);
        return;
      }
      const frequencies = sampleSpectrum(
        data,
        audioRef.current?.currentTime ?? 0,
      );
      const volume = Math.sqrt(audioRef.current?.volume ?? 0);
      const bass = Math.max(...frequencies.slice(0, 9));
      const segments = spokes.map(({ x, y }, index) => {
        // Mirror the audible frequency range around the platter; silence draws no spokes.
        const bin = Math.round(
          (Math.min(index, 96 - index) / 48) * (data.bands - 1),
        );
        const amplitude = Math.min(
          1,
          (bass * 0.3 + (frequencies[bin] ?? 0) * 0.9) * volume * 1.5,
        );
        if (amplitude < 0.035) return "";
        const outer = 123 + amplitude ** 1.5 * 34;
        return `M${150 + x * 123},${150 + y * 123}L${150 + x * outer},${150 + y * outer}`;
      });
      path.setAttribute("d", segments.join(""));
      frame = requestAnimationFrame(draw);
    };
    const restart = () => {
      cancelAnimationFrame(frame);
      draw();
    };
    restart();
    preference.addEventListener("change", restart);
    document.addEventListener("visibilitychange", restart);
    return () => {
      cancelAnimationFrame(frame);
      path.setAttribute("d", "");
      preference.removeEventListener("change", restart);
      document.removeEventListener("visibilitychange", restart);
    };
  }, [audioRef, playing, data]);
  return (
    <svg
      viewBox="0 0 300 300"
      aria-hidden="true"
      {...stylex.props(styles.root)}
    >
      <path ref={pathRef} {...stylex.props(styles.wave)} />
    </svg>
  );
}
