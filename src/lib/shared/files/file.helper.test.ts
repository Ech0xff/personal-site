import { expect, test } from "bun:test";

import { analyzeAudio } from "../audio/audio-analysis.helper";
import {
  audioUploadSchema,
  MAX_AUDIO_BYTES,
  recordConfigSchema,
  resolveTracks,
  builtinAudio,
} from "../audio/audio.schema";
import {
  normalizeRecordSession,
  defaultRecordSession,
  recordSessionSchema,
} from "../audio/record-session.helper";
import { readSpectrum, sampleSpectrum } from "../audio/spectrum.helper";
import { makeFilePath, shouldCompressImage } from "./file.helper";
import { fileUploadSchema, MAX_FILE_SIZE } from "./file.schema";
test("compresses ordinary photos, preserving GIF, SVG and other files", () => {
  expect(shouldCompressImage("image/png")).toBe(true);
  expect(shouldCompressImage("image/jpeg")).toBe(true);
  expect(shouldCompressImage("image/webp")).toBe(true);
  for (const type of [
    "image/gif",
    "image/svg+xml",
    "video/mp4",
    "application/pdf",
    "",
  ])
    expect(shouldCompressImage(type)).toBe(false);
});
test("isolates duplicate names and removes path separators", () => {
  const a = makeFilePath("a", "../my file.pdf");
  expect(a).not.toContain("/");
  expect(a).not.toBe(makeFilePath("b", "../my file.pdf"));
  expect(a).toEndWith(".pdf");
});
test("applies the bucket size limit to all files", () => {
  expect(
    fileUploadSchema.safeParse({
      name: "data.bin",
      size: MAX_FILE_SIZE,
      type: "",
    }).success,
  ).toBe(true);
  expect(
    fileUploadSchema.safeParse({
      name: "data.bin",
      size: MAX_FILE_SIZE + 1,
      type: "",
    }).success,
  ).toBe(false);
  expect(
    fileUploadSchema.safeParse({
      name: "empty.txt",
      size: 0,
      type: "text/plain",
    }).success,
  ).toBe(false);
});

// Audio imports share the file boundary: validate bytes, destinations and derived assets.
test("audio upload limits and legacy versus empty record configuration", () => {
  expect(
    audioUploadSchema.safeParse({ name: "song.MP3", size: MAX_AUDIO_BYTES })
      .success,
  ).toBe(true);
  expect(
    audioUploadSchema.safeParse({ name: "song.mp3", size: MAX_AUDIO_BYTES + 1 })
      .success,
  ).toBe(false);
  expect(
    audioUploadSchema.safeParse({ name: "playlist.m3u", size: 200 }).success,
  ).toBe(false);
  expect(
    recordConfigSchema.parse({}).tracks.map((track) => track.assetId),
  ).toEqual(["quiet-morning", "miku"]);
  expect(recordConfigSchema.parse({ tracks: [] }).tracks).toEqual([]);
  const entry = {
    assetId: "miku",
    title: "Custom title",
    artist: "Custom artist",
  };
  expect(recordConfigSchema.safeParse({ tracks: [entry, entry] }).success).toBe(
    false,
  );
  expect(resolveTracks([entry], builtinAudio)[0].title).toBe("Custom title");
  expect(
    resolveTracks([{ ...entry, assetId: "missing" }], builtinAudio),
  ).toEqual([]);
  expect(
    resolveTracks(
      [entry],
      builtinAudio.map((asset) => ({ ...asset, status: "failed" })),
    ),
  ).toEqual([]);
});
test("generated spectra preserve duration and react to recorded energy", () => {
  const rate = 11025;
  const silence = readSpectrum(
    analyzeAudio(new Float64Array(rate), rate).buffer,
  );
  expect(silence.duration).toBe(1);
  expect([...silence.samples].every((value) => value === 0)).toBe(true);
  const tone = readSpectrum(
    analyzeAudio(
      Float64Array.from(
        { length: rate },
        (_, i) => Math.sin((i * 2 * Math.PI * 440) / rate) * 0.5,
      ),
      rate,
    ).buffer,
  );
  expect(Math.max(...sampleSpectrum(tone, 0.5))).toBeGreaterThan(0.5);
  expect(sampleSpectrum(tone, 2).every((value) => value === 0)).toBe(true);
});

test("dynamic audio sessions retain local-write identity and reconcile removed recordings", () => {
  const tracks = resolveTracks(
    [{ assetId: "miku", title: "Miku", artist: "Artist" }],
    builtinAudio,
  );
  const initial = normalizeRecordSession(defaultRecordSession, tracks);
  expect(initial.trackId).toBe("miku");
  const progressed = { ...initial, positions: { miku: 42 } };
  expect(normalizeRecordSession(progressed, tracks)).toBe(progressed);
  expect(
    normalizeRecordSession(
      progressed,
      tracks.map((track) => ({ ...track, title: "Renamed" })),
    ),
  ).toBe(progressed);
  const replacement = [
    { ...tracks[0], id: "uploaded-recording", duration: 10 },
  ];
  const reconciled = normalizeRecordSession(progressed, replacement);
  expect(reconciled.trackId).toBe("uploaded-recording");
  expect(reconciled.positions).toEqual({ "uploaded-recording": 0 });
  expect(recordSessionSchema.safeParse(reconciled).success).toBe(true);
});
