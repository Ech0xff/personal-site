import { z } from "zod";

import type { AudioTrack } from "./audio.schema";
import { playlist } from "./playlist.const";

export const recordStorageKey = "redesign:record:v1";
export const recordSessionSchema = z.object({
  version: z.literal(1),
  trackId: z.string().min(1),
  positions: z.record(z.string(), z.number().finite().nonnegative()),
});
export type RecordSession = Readonly<z.infer<typeof recordSessionSchema>>;
export const defaultRecordSession: RecordSession = {
  version: 1,
  trackId: playlist[0].id,
  positions: {},
};
export function clampPosition(value: number, duration: number): number {
  return Number.isFinite(value)
    ? Math.max(0, Math.min(value, Math.max(0, duration - 0.05)))
    : 0;
}
export function normalizeRecordSession(
  value: RecordSession,
  tracks: readonly AudioTrack[],
): RecordSession {
  const trackId = tracks.some((track) => track.id === value.trackId)
    ? value.trackId
    : (tracks[0]?.id ?? value.trackId);
  const positions = Object.fromEntries(
    tracks.map((track) => [
      track.id,
      clampPosition(value.positions[track.id] ?? 0, track.duration),
    ]),
  );
  // Preserve identity for this tab's own writes; subscribers must not pause playback.
  if (
    trackId === value.trackId &&
    Object.keys(positions).length === Object.keys(value.positions).length &&
    Object.entries(positions).every(
      ([id, position]) => value.positions[id] === position,
    )
  )
    return value;
  return { ...value, trackId, positions };
}
export function adjacentTrack(
  playlist: readonly AudioTrack[],
  id: RecordSession["trackId"],
  direction: -1 | 1,
) {
  const index = playlist.findIndex((track) => track.id === id);
  return (
    playlist[(index + direction + playlist.length) % playlist.length] ??
    playlist[0]
  );
}
export function formatPlaybackTime(seconds: number): string {
  const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}
