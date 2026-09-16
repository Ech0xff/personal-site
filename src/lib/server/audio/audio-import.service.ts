import "server-only";
import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

import ffmpeg from "ffmpeg-static";
import { parseFile } from "music-metadata";
import { revalidateTag } from "next/cache";

import {
  analyzeAudio,
  readAnalysisPcm,
} from "#lib/shared/audio/audio-analysis.helper";
import {
  AUDIO_BUCKET,
  AUDIO_JOB_MS,
  MAX_AUDIO_BYTES,
  MAX_AUDIO_SECONDS,
  audioImportSchema,
} from "#lib/shared/audio/audio.schema";

import { InputError } from "../actions/action.service";
import { makeAdminClient } from "../supabase.client";
import {
  audioCacheTag,
  createAudioRecord,
  readAudioRecord,
  updateAudioRecord,
} from "./audio-assets.service";
import {
  AudioInputError,
  downloadAudio,
  validateAudioUrl,
} from "./audio-download.service";
import type { AudioRecord } from "./audio-record.schema";

const execute = promisify(execFile);
export async function prepareAudioImport(input: unknown) {
  const request = audioImportSchema.parse(input);
  const id = request.kind === "url" ? randomUUID() : request.id;
  if (request.kind === "url") {
    try {
      validateAudioUrl(request.url);
    } catch {
      throw new InputError(
        "Use a public HTTP or HTTPS audio URL on a standard port.",
      );
    }
    await createAudioRecord(id, {
      source_url: request.url,
      title: "Untitled recording",
    });
  }
  const asset = await readAudioRecord(id);
  if (
    asset.run_id &&
    asset.started_at &&
    Date.now() - Date.parse(asset.started_at) < AUDIO_JOB_MS
  )
    throw new InputError("This recording is already processing.");
  if (asset.status === "ready" && asset.spectrum_status === "ready")
    throw new InputError("This recording is already ready.");
  const runId = randomUUID();
  const claimed = await updateAudioRecord(id, asset.run_id, {
    run_id: runId,
    started_at: new Date().toISOString(),
    error: null,
    status: asset.status === "ready" ? "ready" : "processing",
    spectrum_status: asset.status === "ready" ? "processing" : "pending",
  });
  if (!claimed) throw new InputError("This recording is already processing.");
  return { id, runId };
}
export async function processAudioImport(id: string, runId: string) {
  const client = makeAdminClient();
  const bucket = client.storage.from(AUDIO_BUCKET);
  const temporary = await mkdtemp(join(tmpdir(), "desk-audio-"));
  const controller = new AbortController();
  const timeout = setTimeout(
    () =>
      controller.abort(
        new Error("Processing timed out. Retry this recording."),
      ),
    AUDIO_JOB_MS - 15_000,
  );
  const update = async (values: Partial<AudioRecord>) => {
    if (!(await updateAudioRecord(id, runId, values)))
      throw new Error("A newer import replaced this attempt.");
  };
  const upload = async (
    path: string,
    data: Uint8Array,
    contentType: string,
  ) => {
    if (data.byteLength > MAX_AUDIO_BYTES)
      throw new AudioInputError("Processed audio exceeds 50 MiB.");
    controller.signal.throwIfAborted();
    const { error } = await bucket.upload(path, data, {
      contentType,
      upsert: false,
    });
    if (error) throw error;
    return bucket.getPublicUrl(path).data.publicUrl;
  };
  try {
    if (!ffmpeg) throw new Error("The audio decoder is not installed.");
    const asset = await readAudioRecord(id);
    if (asset.run_id !== runId)
      throw new Error("A newer import replaced this attempt.");
    const playable = join(temporary, "playback.mp3");
    if (asset.status === "ready" && asset.src) {
      // Only server-created storage URLs are accepted for retry input.
      const storagePrefix = bucket.getPublicUrl(`${id}/`).data.publicUrl;
      if (!asset.src.startsWith(storagePrefix))
        throw new Error("Invalid stored audio location.");
      const { data, error: downloadError } = await bucket.download(
        `${id}/${asset.src.slice(storagePrefix.length)}`,
      );
      if (downloadError) throw downloadError;
      await writeFile(playable, new Uint8Array(await data.arrayBuffer()));
    } else {
      const source = join(temporary, "source");
      if (asset.source_path) {
        const { data, error: downloadError } = await bucket.download(
          asset.source_path,
        );
        if (downloadError) throw downloadError;
        if (data.size > MAX_AUDIO_BYTES)
          throw new AudioInputError("Audio exceeds 50 MiB.");
        await writeFile(source, new Uint8Array(await data.arrayBuffer()));
      } else if (asset.source_url) {
        const bytes = await downloadAudio(
          asset.source_url,
          AbortSignal.any([controller.signal, AbortSignal.timeout(60_000)]),
        );
        await writeFile(source, bytes);
        const sourcePath = `${id}/${runId}-source`;
        await upload(sourcePath, bytes, "application/octet-stream");
        await update({ source_path: sourcePath });
      } else throw new Error("Upload an audio file first.");
      const metadata = await parseFile(source, { duration: true });
      if (
        !metadata.format.duration ||
        metadata.format.duration > MAX_AUDIO_SECONDS
      )
        throw new AudioInputError("Audio must be 15 minutes or shorter.");
      if (
        !["MPEG", "MPEG-4", "WAVE", "FLAC"].includes(
          metadata.format.container ?? "",
        )
      )
        throw new AudioInputError(
          "Choose an MP3, M4A, WAV, or FLAC recording.",
        );
      await execute(
        ffmpeg,
        [
          "-v",
          "error",
          "-nostdin",
          "-protocol_whitelist",
          "file,pipe",
          "-i",
          source,
          "-vn",
          "-map",
          "0:a:0",
          "-t",
          String(MAX_AUDIO_SECONDS),
          "-codec:a",
          "libmp3lame",
          "-b:a",
          "192k",
          "-y",
          playable,
        ],
        { signal: controller.signal, maxBuffer: 1024 * 1024 },
      );
      const info = await parseFile(playable, { duration: true });
      if (!info.format.duration)
        throw new Error("Cannot determine the recording duration.");
      const src = await upload(
        `${id}/${runId}.mp3`,
        await readFile(playable),
        "audio/mpeg",
      );
      await update({
        src,
        duration: Math.min(info.format.duration, MAX_AUDIO_SECONDS),
        title: (metadata.common.title || asset.title).slice(0, 200),
        artist: (metadata.common.artist || "").slice(0, 200),
        status: "ready",
        spectrum_status: "processing",
      });
    }
    const pcm = join(temporary, "analysis.wav");
    await execute(
      ffmpeg,
      [
        "-v",
        "error",
        "-nostdin",
        "-protocol_whitelist",
        "file,pipe",
        "-i",
        playable,
        "-ac",
        "1",
        "-ar",
        "11025",
        "-c:a",
        "pcm_s16le",
        "-y",
        pcm,
      ],
      { signal: controller.signal, maxBuffer: 1024 * 1024 },
    );
    const { samples, rate } = readAnalysisPcm(await readFile(pcm));
    controller.signal.throwIfAborted();
    const spectrumSrc = await upload(
      `${id}/${runId}.spectrum.bin`,
      analyzeAudio(samples, rate),
      "application/octet-stream",
    );
    await update({
      spectrum_src: spectrumSrc,
      spectrum_status: "ready",
      error: null,
      run_id: null,
    });
    revalidateTag(audioCacheTag, { expire: 0 });
  } catch (error) {
    console.error("Audio import failed", { id, runId, error });
    const current = await readAudioRecord(id);
    if (current.run_id === runId)
      await update({
        status: current.status === "ready" ? "ready" : "failed",
        spectrum_status: "failed",
        error: controller.signal.aborted
          ? "Processing timed out. Retry this recording."
          : error instanceof AudioInputError
            ? error.message
            : "Audio processing failed. Check the file or URL and retry.",
        run_id: null,
      });
  } finally {
    clearTimeout(timeout);
    await rm(temporary, { recursive: true, force: true });
  }
}
