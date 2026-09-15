import { describe, expect, mock, test } from "bun:test";

import {
  isPublicAddress,
  validateAudioUrl,
  downloadAudio,
} from "../audio/audio-download.service";
import {
  createSessionToken,
  isValidSession,
  matchesAdminToken,
  SESSION_SECONDS,
} from "./session.helper";
const now = new Date("2026-09-13T00:00:00Z");
describe("single-token admin sessions", () => {
  test("accepts a one-character token without trimming or complexity requirements", () => {
    expect(matchesAdminToken("x", "x")).toBe(true);
    expect(matchesAdminToken(" x ", " x ")).toBe(true);
    expect(matchesAdminToken("x", " x ")).toBe(false);
    expect(matchesAdminToken("", undefined)).toBe(false);
    expect(matchesAdminToken("", "")).toBe(false);
  });
  test("validates a signed session and never embeds the access token", async () => {
    const token = "test-private-value";
    const session = await createSessionToken(token, now);
    expect(await isValidSession(session, token, now)).toBe(true);
    expect(
      Buffer.from(session.split(".")[1], "base64url").toString(),
    ).not.toContain(token);
  });
  test("rejects tampering, expiry, missing configuration, and token rotation", async () => {
    const session = await createSessionToken("x", now);
    expect(await isValidSession(`${session.slice(0, -4)}AAAA`, "x", now)).toBe(
      false,
    );
    expect(await isValidSession(session, "y", now)).toBe(false);
    expect(await isValidSession(session, undefined, now)).toBe(false);
    expect(await isValidSession(undefined, "x", now)).toBe(false);
    expect(
      await isValidSession(
        session,
        "x",
        new Date(now.getTime() + SESSION_SECONDS * 1000),
      ),
    ).toBe(false);
  });
  test("desk actions deny anonymous editing reads and writes before validating input", async () => {
    await mock.module("server-only", () => ({}));
    await mock.module("next/headers", () => ({
      cookies: async () => ({ get: () => undefined }),
    }));
    const { updateDeskConfiguration } =
      await import("../desk/desk-configuration.actions");
    const { readAudioLibrary, createAudioUpload } =
      await import("../audio/audio.actions");
    for (const result of [
      await readAudioLibrary(),
      await createAudioUpload({}),
      await updateDeskConfiguration({}),
    ]) {
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.unauthorized).toBe(true);
    }
  });
});

test("audio import rejects private and special network destinations", async () => {
  for (const address of [
    "127.0.0.1",
    "10.0.0.1",
    "172.16.0.1",
    "192.168.1.1",
    "169.254.169.254",
    "100.64.0.1",
    "0.0.0.0",
    "224.0.0.1",
    "::1",
    "fc00::1",
    "fe80::1",
    "::ffff:127.0.0.1",
  ])
    expect(isPublicAddress(address)).toBe(false);
  expect(isPublicAddress("8.8.8.8")).toBe(true);
  expect(isPublicAddress("2606:4700:4700::1111")).toBe(true);
  for (const url of [
    "file:///etc/passwd",
    "http://user:password@example.com/song.mp3",
    "http://example.com:5432/audio",
  ])
    expect(() => validateAudioUrl(url)).toThrow();
  const rejected = await downloadAudio(
    "http://127.0.0.1/private",
    AbortSignal.timeout(1000),
  ).catch((error: unknown) => error);
  expect(rejected).toBeInstanceOf(Error);
  expect(String(rejected)).toContain("public address");
});

test("expired imports preserve playable audio and expose a spectrum retry", async () => {
  await mock.module("server-only", () => ({}));
  const { toAudioAsset } = await import("../audio/audio-assets.service");
  const row = {
    id: "recording",
    title: "Recording",
    artist: "",
    source_path: "recording/source.wav",
    source_url: null,
    src: "/audio/recording.mp3",
    duration: 30,
    spectrum_src: null,
    description_src: null,
    status: "ready",
    spectrum_status: "processing",
    error: null,
    run_id: "c8089027-c759-4711-9ca2-898975b9ef39",
    started_at: "2000-01-01T00:00:00Z",
    created_at: "2000-01-01T00:00:00Z",
  };
  const expired = toAudioAsset(row);
  expect(expired.status).toBe("ready");
  expect(expired.src).toBe(row.src);
  expect(expired.spectrumStatus).toBe("failed");
  expect(expired.error).toContain("timed out");
  expect(toAudioAsset({ ...row, status: "processing" }).status).toBe("failed");
  expect(
    toAudioAsset({ ...row, started_at: new Date().toISOString() })
      .spectrumStatus,
  ).toBe("processing");
});
