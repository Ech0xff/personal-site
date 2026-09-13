import { describe, expect, test } from "bun:test";

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
});
