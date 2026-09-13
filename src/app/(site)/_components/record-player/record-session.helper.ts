import { z } from "zod";

import { playlist } from "#lib/shared/audio/playlist.const";

export const recordStorageKey = "redesign:record:v1";
export const recordSessionSchema = z.object({
  version: z.literal(1),
  trackId: z.enum(playlist.map((track) => track.id)),
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
export function normalizeRecordSession(value: RecordSession): RecordSession {
  return {
    ...value,
    positions: Object.fromEntries(
      playlist.map((track) => [
        track.id,
        clampPosition(value.positions[track.id] ?? 0, track.duration),
      ]),
    ),
  };
}
export function adjacentTrack(id: RecordSession["trackId"], direction: -1 | 1) {
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
