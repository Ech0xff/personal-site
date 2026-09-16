import "server-only";
import { randomUUID } from "node:crypto";

import { cacheLife, cacheTag } from "next/cache";

import {
  AUDIO_BUCKET,
  AUDIO_JOB_MS,
  audioUploadSchema,
  builtinAudio,
  type AudioAsset,
} from "#lib/shared/audio/audio.schema";

import { InputError } from "../actions/action.service";
import { makeAdminClient, makePublicClient } from "../supabase.client";
import {
  audioAssetKey,
  audioRecordSchema,
  audioRecordDefaults,
  parseAudioRecord,
  type AudioRecord,
} from "./audio-record.schema";

export const audioCacheTag = "desk:audio";
type AudioRow = AudioRecord & { readonly id: string };
export function toAudioAsset(row: AudioRow): AudioAsset {
  const expired =
    row.run_id !== null &&
    row.started_at !== null &&
    Date.now() - Date.parse(row.started_at) > AUDIO_JOB_MS;
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    src: row.src,
    duration: row.duration,
    spectrumSrc: row.spectrum_src,
    descriptionSrc: row.description_src,
    status: row.status === "ready" ? "ready" : expired ? "failed" : row.status,
    spectrumStatus:
      expired && row.spectrum_status !== "ready"
        ? "failed"
        : row.spectrum_status,
    error: expired ? "Processing timed out. Retry this recording." : row.error,
    startedAt: row.started_at,
  };
}
export async function listAudioAssets(): Promise<AudioAsset[]> {
  const { data, error } = await makeAdminClient()
    .from("configs")
    .select("key,value")
    .like("key", "audio.asset.%")
    .order("value->>created_at", { ascending: false });
  if (error) throw error;
  return data.map((row) => toAudioAsset(parseAudioRecord(row)));
}
export async function readPublicAudioAssets(): Promise<readonly AudioAsset[]> {
  "use cache";
  cacheLife("hours");
  cacheTag(audioCacheTag, "desk:configuration");
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
    return builtinAudio;
  const { data, error } = await makePublicClient().rpc("read_desk_audio");
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    artist: row.artist,
    src: row.src,
    duration: row.duration,
    spectrumSrc: row.spectrum_src,
    descriptionSrc: row.description_src,
    status: "ready",
    spectrumStatus: row.spectrum_src ? "ready" : "failed",
    error: null,
    startedAt: null,
  }));
}
export async function signAudioUpload(input: unknown) {
  const file = audioUploadSchema.parse(input);
  const id = randomUUID();
  const path = `${id}/source.${file.name.split(".").at(-1)?.toLowerCase()}`;
  const client = makeAdminClient();
  await createAudioRecord(id, {
    title: file.name.replace(/\.[^.]+$/, ""),
    source_path: path,
    status: "uploading",
  });
  const result = await client.storage
    .from(AUDIO_BUCKET)
    .createSignedUploadUrl(path, { upsert: false });
  if (result.error) throw result.error;
  return { id, path, token: result.data.token };
}
export async function validateAudioReferences(ids: readonly string[]) {
  if (!ids.length) return;
  const { data, error } = await makeAdminClient()
    .from("configs")
    .select("key,value")
    .in("key", [...new Set(ids)].map(audioAssetKey));
  if (error) throw error;
  const assets = data.map(parseAudioRecord);
  if (
    ids.some(
      (id) =>
        !assets.some(
          (row) =>
            row.id === id && row.status === "ready" && row.src && row.duration,
        ),
    )
  )
    throw new InputError(
      "Wait until every selected recording is ready to play.",
    );
}

export async function createAudioRecord(
  id: string,
  input: Partial<AudioRecord>,
) {
  const value = audioRecordSchema.parse({
    ...audioRecordDefaults,
    created_at: new Date().toISOString(),
    ...input,
  });
  const { error } = await makeAdminClient()
    .from("configs")
    .insert({ key: audioAssetKey(id), value });
  if (error) throw error;
}
export async function readAudioRecord(id: string) {
  const { data, error } = await makeAdminClient()
    .from("configs")
    .select("key,value")
    .eq("key", audioAssetKey(id))
    .single();
  if (error) throw error;
  return parseAudioRecord(data);
}
export async function updateAudioRecord(
  id: string,
  runId: string | null,
  patch: Partial<AudioRecord>,
) {
  const { data, error } = await makeAdminClient().rpc("update_audio_asset", {
    asset_id: id,
    ...(runId === null ? {} : { expected_run_id: runId }),
    patch: audioRecordSchema.partial().parse(patch),
  });
  if (error) throw error;
  return data === null ? null : audioRecordSchema.parse(data);
}
