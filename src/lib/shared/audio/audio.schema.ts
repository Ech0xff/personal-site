import { z } from "zod";

import { playlist } from "./playlist.const";

export const AUDIO_BUCKET = "audio";
export const MAX_AUDIO_BYTES = 50 * 1024 * 1024;
export const MAX_AUDIO_SECONDS = 15 * 60;
export const AUDIO_JOB_MS = 270_000;
export const trackEntrySchema = z.object({
  assetId: z.string().min(1).max(100),
  title: z.string().trim().min(1).max(200),
  artist: z.string().trim().max(200),
});
export const recordConfigSchema = z.object({
  tracks: z
    .array(trackEntrySchema)
    .max(100)
    .refine(
      (tracks) =>
        new Set(tracks.map((track) => track.assetId)).size === tracks.length,
      "Each recording can only appear once.",
    )
    .default(
      playlist.map((track) => ({
        assetId: track.id,
        title: track.title,
        artist: track.artist,
      })),
    ),
});
export const audioUploadSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(255)
    .regex(/\.(mp3|m4a|wav|flac)$/i, "Choose an MP3, M4A, WAV, or FLAC file."),
  size: z
    .number()
    .int()
    .positive()
    .max(MAX_AUDIO_BYTES, "Audio must be 50 MiB or smaller."),
});
export const audioImportSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("upload"), id: z.uuid() }),
  z.object({
    kind: z.literal("url"),
    url: z.url({ protocol: /^https?$/ }).max(2048),
  }),
  z.object({ kind: z.literal("retry"), id: z.uuid() }),
]);
export const audioAssetSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  src: z.string().nullable(),
  duration: z.number().positive().nullable(),
  spectrumSrc: z.string().nullable(),
  descriptionSrc: z.string().nullable(),
  status: z.enum(["uploading", "pending", "processing", "ready", "failed"]),
  spectrumStatus: z.enum(["pending", "processing", "ready", "failed"]),
  error: z.string().nullable(),
  startedAt: z.string().nullable(),
});
export const audioTrackSchema = audioAssetSchema
  .pick({
    id: true,
    title: true,
    artist: true,
    spectrumSrc: true,
    descriptionSrc: true,
  })
  .extend({
    src: z.string().min(1),
    duration: z.number().positive(),
  });
export type AudioAsset = z.infer<typeof audioAssetSchema>;
export type AudioTrack = z.infer<typeof audioTrackSchema>;
export type TrackEntry = z.infer<typeof trackEntrySchema>;
export const builtinAudio: readonly AudioAsset[] = playlist.map((track) => ({
  ...track,
  status: "ready",
  spectrumStatus: "ready",
  error: null,
  startedAt: null,
}));
export function resolveTracks(
  entries: readonly TrackEntry[],
  assets: readonly AudioAsset[],
): AudioTrack[] {
  return entries.flatMap((entry) => {
    const asset = assets.find((candidate) => candidate.id === entry.assetId);
    const parsed = audioTrackSchema.safeParse(
      asset && { ...asset, title: entry.title, artist: entry.artist },
    );
    return asset?.status === "ready" && parsed.success ? [parsed.data] : [];
  });
}
