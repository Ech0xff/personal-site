import { describe, expect, mock, spyOn, test } from "bun:test";

await mock.module("server-only", () => ({}));
await mock.module("next/headers", () => ({
  cookies: async () => ({ get: () => undefined }),
}));
const { startAudioImport, uploadAudio } =
  await import("./audio-import.service");

describe("audio import authentication recovery", () => {
  test("rejects an expired upload session before transferring audio", async () => {
    const request = spyOn(globalThis, "fetch");
    try {
      const result = await uploadAudio(
        new File(["audio"], "recording.mp3", { type: "audio/mpeg" }),
      );
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.unauthorized).toBe(true);
        expect(result.error).toContain("session has expired");
      }
      expect(request).not.toHaveBeenCalled();
    } finally {
      request.mockRestore();
    }
  });

  test.each([
    { kind: "url", url: "https://example.com/recording.mp3" },
    { kind: "retry", id: "a2463c5a-e290-42c0-9856-66eb31b8aafe" },
  ] as const)("keeps HTTP 401 recoverable for $kind imports", async (input) => {
    const request = spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json({ ok: false, error: "Sign in again." }, { status: 401 }),
    );
    try {
      expect(await startAudioImport(input)).toEqual({
        ok: false,
        error: "Sign in again.",
        unauthorized: true,
      });
    } finally {
      request.mockRestore();
    }
  });

  test("preserves validation failures without asking for authentication", async () => {
    const request = spyOn(globalThis, "fetch").mockResolvedValue(
      Response.json(
        { ok: false, error: "Unsupported audio format." },
        { status: 400 },
      ),
    );
    try {
      expect(
        await startAudioImport({
          kind: "url",
          url: "https://example.com/recording.txt",
        }),
      ).toEqual({
        ok: false,
        error: "Unsupported audio format.",
        unauthorized: false,
      });
    } finally {
      request.mockRestore();
    }
  });
});
