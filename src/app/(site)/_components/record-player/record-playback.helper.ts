import { z } from "zod";

import { playlist } from "#lib/shared/audio/playlist.const";

import { adjacentTrack, type RecordSession } from "./record-session.helper";

export const playbackModeSchema = z.enum([
  "repeat-all",
  "repeat-one",
  "shuffle",
]);
export type PlaybackMode = z.infer<typeof playbackModeSchema>;
export const playbackModeLabels: Readonly<Record<PlaybackMode, string>> = {
  "repeat-all": "Repeat all",
  "repeat-one": "Repeat one",
  shuffle: "Shuffle",
};
export function cyclePlaybackMode(mode: PlaybackMode): PlaybackMode {
  if (mode === "repeat-all") return "repeat-one";
  return mode === "repeat-one" ? "shuffle" : "repeat-all";
}
export function nextRecordTrack(
  id: RecordSession["trackId"],
  mode: PlaybackMode,
  direction: -1 | 1,
  random: number,
) {
  if (mode !== "shuffle") return adjacentTrack(id, direction);
  const candidates = playlist.filter((track) => track.id !== id);
  const index = Math.min(
    candidates.length - 1,
    Math.max(0, Math.floor(random * candidates.length)),
  );
  return candidates[index] ?? playlist[0];
}
