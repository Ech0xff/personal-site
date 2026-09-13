import * as stylex from "@stylexjs/stylex";
import { useAtom } from "jotai";

import { foundation } from "../../_design/foundation.style";
import { styles } from "./record-controls.style";
import {
  cyclePlaybackMode,
  playbackModeLabels,
} from "./record-playback.helper";
import {
  playbackModeAtom,
  recordControlsPinnedAtom,
} from "./record-preferences.atom";
import { RecordSeek } from "./record-seek.component";
import { formatPlaybackTime } from "./record-session.helper";

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
  return (
    <fieldset
      {...stylex.props(styles.root, pinned && styles.pinned)}
      aria-label="Record controls"
    >
      <RecordSeek
        title={title}
        position={position}
        duration={duration}
        seek={seek}
        pinned={pinned}
      />
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
