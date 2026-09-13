"use client";
import * as stylex from "@stylexjs/stylex";

import {
  media,
  motionToken,
  shadow,
  shape,
  material,
} from "#design/tokens.stylex";
import { playlist } from "#lib/shared/audio/playlist.const";

import { foundation } from "../../_design/foundation.style";
import {
  objectMarker,
  recordMarker,
} from "../../_design/object-feedback.stylex";
import { ObjectFeedback } from "../object-feedback.component";
import { RecordControls } from "./record-controls.component";
import { RecordSpectrum } from "./record-spectrum.component";
import { useRecordPlayer } from "./use-record-player.hook";
const spin = stylex.keyframes({
  from: { transform: "rotate(0deg)" },
  to: { transform: "rotate(360deg)" },
});
const styles = stylex.create({
  root: {
    position: "relative",
    width: { default: "clamp(270px, 24vw, 320px)", [media.compact]: "290px" },
    maxWidth: "100%",
    textAlign: "center",
  },
  deck: { position: "relative", paddingRight: "60px" },
  platter: { position: "relative" },
  button: {
    display: "block",
    position: "relative",
    borderWidth: 0,
    borderStyle: "solid",
    padding: 0,
    backgroundColor: "transparent",
    borderRadius: shape.round,
    width: "100%",
    aspectRatio: "1",
    outline: "none",
    transform: {
      default: "rotate(-3deg)",
      [stylex.when.ancestor(":hover", objectMarker)]:
        "scale(1.02) rotate(0deg)",
      [stylex.when.ancestor(":has(:focus-visible)", objectMarker)]:
        "scale(1.02) rotate(0deg)",
      [media.reduce]: "rotate(-3deg)",
    },
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
  disc: {
    position: "absolute",
    inset: 0,
    borderRadius: shape.round,
    backgroundColor: material.vinyl,
    backgroundImage: `repeating-radial-gradient(circle, transparent 0 2px, ${material.grooves} 3px, transparent 4px), ${material.vinylSheen}`,
    boxShadow: shadow.lifted,
    borderWidth: "3px",
    borderStyle: "solid",
    borderColor: `${material.vinyl}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    animationName: spin,
    animationDuration: motionToken.record,
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
    animationPlayState: "paused",
  },
  spinning: {
    animationPlayState: { default: "running", [media.reduce]: "paused" },
  },
  hole: {
    width: "58px",
    height: "58px",
    backgroundColor: material.recordMark,
    borderRadius: shape.round,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: material.recordLabel,
    display: "grid",
    placeItems: "center",
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    color: material.vinyl,
    pointerEvents: "none",
  },
  spindle: {
    width: "7px",
    height: "7px",
    borderRadius: shape.round,
    backgroundColor: material.vinyl,
  },
  arm: {
    pointerEvents: "none",
    position: "absolute",
    width: "9px",
    height: "150px",
    right: "32px",
    top: "-3px",
    borderRadius: "5px",
    backgroundImage: material.tonearm,
    boxShadow: shadow.detail,
    transform: "rotate(-12deg)",
    transformOrigin: "50% 12px",
    transitionProperty: "transform",
    transitionDuration: { default: motionToken.slow, [media.reduce]: "0s" },
    transitionTimingFunction: motionToken.ease,
  },
  armPlaying: { transform: "rotate(24deg)" },
  pivot: {
    position: "absolute",
    top: "-9px",
    left: "-9px",
    width: "27px",
    height: "27px",
    borderRadius: shape.round,
    backgroundImage: material.pivot,
    boxShadow: shadow.contact,
  },
  needle: {
    position: "absolute",
    bottom: "-9px",
    left: "-2px",
    width: "13px",
    height: "27px",
    backgroundColor: material.recordLabel,
    borderRadius: "3px",
    transform: "rotate(-12deg)",
  },
});
export function RecordPlayer() {
  const player = useRecordPlayer();
  const { track } = player;
  const playing = player.state === "playing";
  const status = {
    idle: "Music paused",
    loading: "Finding the first note…",
    playing: "Music playing",
    blocked: "Music paused",
    error: "Audio unavailable",
  }[player.state];
  return (
    <section
      {...stylex.props(styles.root, recordMarker)}
      aria-label={`${track.title} — ${track.artist}`}
      data-playing={playing}
    >
      <div {...stylex.props(styles.deck)}>
        <div {...stylex.props(styles.platter, objectMarker)}>
          <RecordSpectrum
            audioRef={player.audioRef}
            playing={playing}
            src={track.spectrumSrc}
          />
          <button
            type="button"
            {...stylex.props(styles.button)}
            aria-label={player.active ? "Pause music" : "Play music"}
            aria-pressed={player.active}
            aria-describedby="record-status"
            onClick={player.toggle}
          >
            <ObjectFeedback label="Music" round />
            <span
              {...stylex.props(styles.disc, playing && styles.spinning)}
              aria-hidden="true"
            />
            <span {...stylex.props(styles.hole)} aria-hidden="true">
              <span {...stylex.props(styles.spindle)} />
            </span>
          </button>
          <RecordControls
            title={track.title}
            active={player.active}
            toggle={player.toggle}
            position={player.position}
            duration={player.duration}
            previous={player.previous}
            next={player.next}
            seek={player.seek}
          />
        </div>
        <span
          {...stylex.props(styles.arm, playing && styles.armPlaying)}
          aria-hidden="true"
        >
          <i {...stylex.props(styles.pivot)} />
          <i {...stylex.props(styles.needle)} />
        </span>
      </div>
      <output id="record-status" {...stylex.props(foundation.srOnly)}>
        {status}
      </output>
      {playlist.map((item) => (
        <audio
          key={item.id}
          ref={(element) => player.bindAudio(item.id, element)}
          preload="metadata"
          onLoadedMetadata={(event) => {
            if (event.currentTarget === player.audioRef.current)
              player.onMetadata();
          }}
          onTimeUpdate={(event) => {
            if (event.currentTarget === player.audioRef.current)
              player.onTimeUpdate();
          }}
          onEnded={(event) => {
            if (event.currentTarget === player.audioRef.current)
              player.onEnded();
          }}
          onError={(event) => {
            if (event.currentTarget === player.audioRef.current)
              player.onError();
          }}
          onPause={(event) => {
            if (event.currentTarget === player.audioRef.current)
              player.onPause();
          }}
          onWaiting={(event) => {
            if (event.currentTarget === player.audioRef.current)
              player.onWaiting();
          }}
          onPlaying={(event) => {
            if (event.currentTarget === player.audioRef.current)
              player.onPlaying();
          }}
        >
          <track
            kind="captions"
            src={item.descriptionSrc}
            srcLang="en"
            label="Music description"
            default
          />
        </audio>
      ))}
    </section>
  );
}
