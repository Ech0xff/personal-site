import "server-only";
import { randomUUID } from "node:crypto";

import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import {
  AUDIO_BUCKET,
  AUDIO_JOB_MS,
  audioUploadSchema,
  builtinAudio,
  type AudioAsset,
} from "#lib/shared/audio/audio.schema";
import type { Database } from "#types/supabase";

import { InputError } from "../actions/action.service";
import { makeAdminClient, makePublicClient } from "../supabase.client";

export const audioCacheTag = "desk:audio";
type AudioRow = Database["public"]["Tables"]["audio_assets"]["Row"];
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
    status:
      row.status === "ready"
        ? "ready"
        : expired
          ? "failed"
          : z
              .enum(["uploading", "pending", "processing", "failed"])
              .parse(row.status),
    spectrumStatus:
      expired && row.spectrum_status !== "ready"
        ? "failed"
        : z
            .enum(["pending", "processing", "ready", "failed"])
            .parse(row.spectrum_status),
    error: expired ? "Processing timed out. Retry this recording." : row.error,
    startedAt: row.started_at,
  };
}
export async function listAudioAssets(): Promise<AudioAsset[]> {
  const { data, error } = await makeAdminClient()
    .from("audio_assets")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data.map(toAudioAsset);
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
  const { error } = await client.from("audio_assets").insert({
    id,
    title: file.name.replace(/\.[^.]+$/, ""),
    source_path: path,
    status: "uploading",
  });
  if (error) throw error;
  const result = await client.storage
    .from(AUDIO_BUCKET)
    .createSignedUploadUrl(path, { upsert: false });
  if (result.error) throw result.error;
  return { id, path, token: result.data.token };
}
export async function validateAudioReferences(ids: readonly string[]) {
  if (!ids.length) return;
  const { data, error } = await makeAdminClient()
    .from("audio_assets")
    .select("id,src,duration,status")
    .in("id", [...new Set(ids)]);
  if (error) throw error;
  if (
    ids.some(
      (id) =>
        !data.some(
          (row) =>
            row.id === id && row.status === "ready" && row.src && row.duration,
        ),
    )
  )
    throw new InputError(
      "Wait until every selected recording is ready to play.",
    );
}
