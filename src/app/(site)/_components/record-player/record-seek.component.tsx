/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Curved SVG geometry implements slider keyboard and ARIA semantics. */
import * as stylex from "@stylexjs/stylex";
import { useId, type PointerEvent } from "react";

import { formatPlaybackTime } from "#lib/shared/audio/record-session.helper";

import { arcPoint, arcProgress } from "./record-arc.helper";
import { styles } from "./record-controls.style";
const seekPath = "M63.708 152.5 A65 65 0 0 0 176.292 152.5";

export function RecordSeek({
  title,
  position,
  duration,
  seek,
  pinned,
}: Readonly<{
  title: string;
  position: number;
  duration: number;
  seek: (value: number) => void;
  pinned: boolean;
}>) {
  const id = useId();
  const progress =
    duration > 0 ? Math.min(1, Math.max(0, position / duration)) : 0;
  const dot = arcPoint(progress);
  const seekAtPointer = (event: PointerEvent<SVGPathElement>) => {
    const matrix = event.currentTarget.ownerSVGElement?.getScreenCTM();
    if (!matrix) return;
    const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(
      matrix.inverse(),
    );
    seek(arcProgress(point.x, point.y) * duration);
  };
  return (
    <svg viewBox="0 0 240 240" {...stylex.props(styles.ring)}>
      <defs>
        <path id={`${id}-title`} d="M36 120 A84 84 0 0 1 204 120" />
      </defs>
      <g aria-hidden="true">
        <text {...stylex.props(styles.title)}>
          <textPath href={`#${id}-title`} startOffset="50%" textAnchor="middle">
            {title}
          </textPath>
        </text>
      </g>
      <path
        d={seekPath}
        role="slider"
        tabIndex={0}
        aria-label={`Playback position for ${title}`}
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={position}
        aria-valuetext={`${formatPlaybackTime(position)} of ${formatPlaybackTime(duration)}`}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          seekAtPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId))
            seekAtPointer(event);
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            seekAtPointer(event);
            event.currentTarget.releasePointerCapture(event.pointerId);
          }
        }}
        onKeyDown={(event) => {
          const target = {
            ArrowRight: position + 5,
            ArrowUp: position + 5,
            ArrowLeft: position - 5,
            ArrowDown: position - 5,
            Home: 0,
            End: duration,
            PageUp: position + 10,
            PageDown: position - 10,
          }[event.key];
          if (target === undefined) return;
          event.preventDefault();
          seek(target);
        }}
        {...stylex.props(
          styles.seek,
          styles.interactive,
          pinned && styles.pinnedInteractive,
        )}
      />
      <g aria-hidden="true">
        <path d={seekPath} {...stylex.props(styles.rail)} />
        <path
          d={seekPath}
          pathLength={1}
          strokeDasharray={`${progress} 1`}
          {...stylex.props(styles.fill)}
        />
        <circle cx={dot.x} cy={dot.y} r={3} {...stylex.props(styles.dot)} />
      </g>
    </svg>
  );
}
