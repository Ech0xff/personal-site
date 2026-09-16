import { z } from "zod";

import { MAX_AUDIO_SECONDS } from "#lib/shared/audio/audio.schema";

// Keep defaults out of this schema: partial updates must contain only supplied fields.
export const audioRecordSchema = z.object({
  title: z.string(),
  artist: z.string(),
  source_path: z.string().nullable(),
  source_url: z.string().nullable(),
  src: z.string().nullable(),
  duration: z.number().positive().max(MAX_AUDIO_SECONDS).nullable(),
  spectrum_src: z.string().nullable(),
  description_src: z.string().nullable(),
  status: z.enum(["uploading", "pending", "processing", "ready", "failed"]),
  spectrum_status: z.enum(["pending", "processing", "ready", "failed"]),
  error: z.string().nullable(),
  run_id: z.uuid().nullable(),
  started_at: z.iso.datetime({ offset: true }).nullable(),
  created_at: z.iso.datetime({ offset: true }),
});
export type AudioRecord = z.infer<typeof audioRecordSchema>;
export const audioRecordDefaults = {
  title: "",
  artist: "",
  source_path: null,
  source_url: null,
  src: null,
  duration: null,
  spectrum_src: null,
  description_src: null,
  status: "pending",
  spectrum_status: "pending",
  error: null,
  run_id: null,
  started_at: null,
} satisfies Omit<AudioRecord, "created_at">;
export const audioAssetKey = (id: string): string => `audio.asset.${id}`;
export function parseAudioRecord(row: { key: string; value: unknown }) {
  return {
    ...audioRecordSchema.parse(row.value),
    id: row.key.slice("audio.asset.".length),
  };
}
