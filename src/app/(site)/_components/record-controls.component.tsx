/* oxlint-disable jsx-a11y/prefer-tag-over-role -- A curved SVG slider needs its own pointer geometry; it implements slider keyboard and ARIA semantics. */
import * as stylex from "@stylexjs/stylex";
import { useAtom } from "jotai";
import { useId, type PointerEvent } from "react";

import { foundation } from "../_design/foundation.style";
import { recordMarker } from "../_design/object-feedback.stylex";
import {
  material,
  font,
  media,
  motionToken,
  shape,
} from "../_design/tokens.stylex";
import {
  playbackModeAtom,
  recordControlsPinnedAtom,
} from "./desk-preferences.atom";
import { arcPoint, arcProgress } from "./record-arc.helper";
import {
  cyclePlaybackMode,
  playbackModeLabels,
} from "./record-playback.helper";
import { formatPlaybackTime } from "./record-session.helper";

const styles = stylex.create({
  root: {
    margin: 0,
    padding: 0,
    borderWidth: 0,
    minWidth: 0,
    position: "absolute",
    inset: 0,
    pointerEvents: "none",
    opacity: {
      default: 0,
      [media.phone]: 1,
      [media.touch]: 1,
      [stylex.when.ancestor(":hover", recordMarker)]: 1,
      [stylex.when.ancestor(":has(:focus-visible)", recordMarker)]: 1,
    },
    transitionProperty: "opacity",
    transitionDuration: { default: motionToken.normal, [media.reduce]: "0s" },
  },
  pinned: { opacity: 1 },
  interactive: {
    pointerEvents: {
      default: "none",
      [media.phone]: "auto",
      [media.touch]: "auto",
      [stylex.when.ancestor(":hover", recordMarker)]: "auto",
      [stylex.when.ancestor(":has(:focus-visible)", recordMarker)]: "auto",
    },
  },
  pinnedInteractive: { pointerEvents: "auto" },
  ring: {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    overflow: "visible",
  },
  title: {
    fill: material.playerText,
    fontFamily: font.mono,
    fontSize: font.small,
    letterSpacing: "1.4px",
  },
  rail: {
    fill: "none",
    stroke: material.playerRail,
    strokeWidth: 2,
    strokeLinecap: "round",
    opacity: 0.6,
  },
  fill: {
    fill: "none",
    stroke: material.playerAccent,
    strokeWidth: 2.5,
    strokeLinecap: "round",
  },
  dot: { fill: material.playerText },
  seek: {
    fill: "none",
    stroke: { default: "transparent", ":focus-visible": material.playerHover },
    strokeWidth: 20,
    strokeLinecap: "round",
    outline: "none",
    cursor: "pointer",
    touchAction: "none",
  },
  button: {
    position: "absolute",
    display: "grid",
    placeItems: "center",
    width: shape.touch,
    height: shape.touch,
    padding: 0,
    borderWidth: 0,
    borderRadius: shape.round,
    backgroundColor: "transparent",
    color: {
      default: material.playerText,
      ":hover": material.playerText,
      ":focus-visible": material.playerText,
    },
    opacity: { default: 0.8, ":hover": 1, ":focus-visible": 1 },
    transitionProperty: "opacity",
    transitionDuration: motionToken.fast,
  },
  pinnedIcon: { transform: "rotate(35deg)" },
  pin: { left: "29.17%", top: "86.08%", transform: "translate(-50%, -50%)" },
  play: { left: "50%", top: "91.67%", transform: "translate(-50%, -50%)" },
  mode: { left: "70.83%", top: "86.08%", transform: "translate(-50%, -50%)" },
  previous: {
    left: "13.92%",
    top: "70.83%",
    transform: "translate(-50%, -50%)",
  },
  next: { left: "86.08%", top: "70.83%", transform: "translate(-50%, -50%)" },
  pinIcon: {
    width: "15px",
    height: "15px",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.normal, [media.reduce]: "0s" },
  },
  icon: { width: "13px", height: "13px", fill: "currentColor" },
  reverse: { transform: "rotate(180deg)" },
  time: {
    position: "absolute",
    top: "64%",
    left: 0,
    right: 0,
    fontFamily: font.mono,
    fontSize: font.tiny,
    color: material.playerText,
    fontVariantNumeric: "tabular-nums",
    letterSpacing: "0.5px",
  },
});
const seekPath = "M63.708 152.5 A65 65 0 0 0 176.292 152.5";

export function RecordControls({
  title,
  active,
  toggle,
  position,
  duration,
  previous,
  next,
  seek,
}: Readonly<{
  title: string;
  active: boolean;
  toggle: () => void;
  position: number;
  duration: number;
  previous: () => void;
  next: () => void;
  seek: (position: number) => void;
}>) {
  const [mode, setMode] = useAtom(playbackModeAtom);
  const [pinned, setPinned] = useAtom(recordControlsPinnedAtom);
  const id = useId();
  const progress =
    duration > 0 ? Math.min(1, Math.max(0, position / duration)) : 0;
  const dot = arcPoint(progress);
  const seekAtPointer = (event: PointerEvent<SVGPathElement>) => {
    const bounds = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (!bounds) return;
    seek(
      arcProgress(
        ((event.clientX - bounds.left) / bounds.width) * 240,
        ((event.clientY - bounds.top) / bounds.height) * 240,
      ) * duration,
    );
  };
  return (
    <fieldset
      {...stylex.props(styles.root, pinned && styles.pinned)}
      aria-label="Record controls"
    >
      <svg viewBox="0 0 240 240" {...stylex.props(styles.ring)}>
        <defs>
          <path id={`${id}-title`} d="M36 120 A84 84 0 0 1 204 120" />
        </defs>
        <g aria-hidden="true">
          <text {...stylex.props(styles.title)}>
            <textPath
              href={`#${id}-title`}
              startOffset="50%"
              textAnchor="middle"
            >
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
      <button
        type="button"
        aria-label="Previous track"
        onClick={previous}
        {...stylex.props(
          styles.button,
          styles.previous,
          foundation.focus,
          styles.interactive,
          pinned && styles.pinnedInteractive,
        )}
      >
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          {...stylex.props(styles.icon)}
        >
          <path d="M3 3H5V13H3ZM13 3V13L5 8Z" />
        </svg>
      </button>
      <button
        type="button"
        aria-label={pinned ? "Unpin record controls" : "Pin record controls"}
        aria-pressed={pinned}
        onClick={() => setPinned((value) => !value)}
        {...stylex.props(
          styles.button,
          styles.pin,
          foundation.focus,
          styles.interactive,
          pinned && styles.pinnedInteractive,
        )}
      >
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stylex.props(styles.pinIcon, pinned && styles.pinnedIcon)}
        >
          <path d="M7 3h6l-1 5 3 3v2H5v-2l3-3-1-5ZM10 13v4" />
        </svg>
      </button>
      <button
        type="button"
        aria-label={active ? "Pause music" : "Play music"}
        aria-pressed={active}
        onClick={toggle}
        {...stylex.props(
          styles.button,
          styles.play,
          foundation.focus,
          styles.interactive,
          pinned && styles.pinnedInteractive,
        )}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          {...stylex.props(styles.icon)}
        >
          <path d={active ? "M6 5h4v14H6zM14 5h4v14h-4z" : "M8 4v16l12-8z"} />
        </svg>
      </button>
      <button
        type="button"
        aria-label={`Playback mode: ${playbackModeLabels[mode]}. Switch to ${playbackModeLabels[cyclePlaybackMode(mode)]}`}
        title={playbackModeLabels[mode]}
        onClick={() => setMode(cyclePlaybackMode)}
        {...stylex.props(
          styles.button,
          styles.mode,
          foundation.focus,
          styles.interactive,
          pinned && styles.pinnedInteractive,
        )}
      >
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          {...stylex.props(styles.pinIcon)}
        >
          {mode === "shuffle" ? (
            <path d="M3 5h2c4 0 6 10 10 10h2m-3-3 3 3-3 3M3 15h2c1.6 0 3-1.5 4.3-3.5M11 8c1.4-2 2.6-3 4-3h2m-3-3 3 3-3 3" />
          ) : (
            <>
              <path d="M3 9V7a3 3 0 0 1 3-3h10l-3-3m3 3-3 3M17 11v2a3 3 0 0 1-3 3H4l3 3m-3-3 3-3" />
              {mode === "repeat-one" && <path d="m9 9 1-1v5m-1 0h2" />}
            </>
          )}
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next track"
        onClick={next}
        {...stylex.props(
          styles.button,
          styles.next,
          foundation.focus,
          styles.interactive,
          pinned && styles.pinnedInteractive,
        )}
      >
        <svg
          viewBox="0 0 16 16"
          aria-hidden="true"
          {...stylex.props(styles.icon, styles.reverse)}
        >
          <path d="M3 3H5V13H3ZM13 3V13L5 8Z" />
        </svg>
      </button>
      <span aria-hidden="true" {...stylex.props(styles.time)}>
        {formatPlaybackTime(position)} / {formatPlaybackTime(duration)}
      </span>
    </fieldset>
  );
}
