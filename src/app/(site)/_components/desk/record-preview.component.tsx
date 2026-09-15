/* oxlint-disable jsx-a11y/media-has-caption -- Imported audio has no supplied transcript; preserve supplied captions. */
import * as stylex from "@stylexjs/stylex";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Button from "#components/ui/button.component";
import type { AudioAsset } from "#lib/shared/audio/audio.schema";

import { editorStyles as styles } from "./item-editor.style";

export function recordingTime(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
}

export function RecordPreview({ asset }: Readonly<{ asset: AudioAsset }>) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [error, setError] = useState("");
  useEffect(() => {
    const node = audio.current;
    return () => node?.pause();
  }, []);
  if (!asset.src)
    return <p {...stylex.props(styles.muted)}>Preparing audio…</p>;
  return (
    <div {...stylex.props(styles.group)}>
      <audio
        ref={audio}
        src={asset.src}
        hidden
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={() => setPosition(audio.current?.currentTime ?? 0)}
        onError={() =>
          setError("Could not play this recording. Please try again.")
        }
      >
        {asset.descriptionSrc && (
          <track
            kind="captions"
            src={asset.descriptionSrc}
            srcLang="en"
            default
          />
        )}
      </audio>
      <div {...stylex.props(styles.previewPlayer)}>
        <Button
          aria-label={playing ? "Pause preview" : "Play preview"}
          onClick={async () => {
            const node = audio.current;
            if (!node) return;
            setError("");
            if (node.paused) {
              try {
                await node.play();
              } catch {
                setError("Could not play this recording. Please try again.");
              }
            } else node.pause();
          }}
        >
          {playing ? <Pause size={18} /> : <Play size={18} />}
        </Button>
        <input
          type="range"
          aria-label="Preview position"
          min={0}
          max={asset.duration ?? 0}
          step={0.1}
          value={position}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (audio.current) audio.current.currentTime = next;
            setPosition(next);
          }}
          {...stylex.props(styles.seek)}
        />
        <span {...stylex.props(styles.previewTime)}>
          {recordingTime(position)} / {recordingTime(asset.duration ?? 0)}
        </span>
      </div>
      {error && (
        <p role="alert" {...stylex.props(styles.error)}>
          {error}
        </p>
      )}
    </div>
  );
}
