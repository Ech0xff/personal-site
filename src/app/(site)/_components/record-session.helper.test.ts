import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  adjacentTrack,
  clampPosition,
  defaultRecordSession,
  formatPlaybackTime,
  readRecordSession,
} from "./record-session.helper";

await describe("record session recovery", async () => {
  await it("starts with the original music and rejects corrupted or obsolete storage", () => {
    for (const value of [
      null,
      "broken",
      '{"version":2}',
      '{"version":1,"trackId":"removed","positions":{}}',
      '{"version":1,"trackId":"miku","positions":{"miku":-1}}',
    ]) {
      assert.deepEqual(readRecordSession(value), defaultRecordSession);
    }
  });
  await it("restores each track independently and bounds progress against track duration", () => {
    const session = readRecordSession(
      JSON.stringify({
        version: 1,
        trackId: "miku",
        positions: { "quiet-morning": 6.25, miku: 999, unknown: 1 },
      }),
    );
    assert.equal(session.trackId, "miku");
    assert.equal(session.positions["quiet-morning"], 6.25);
    assert.equal(session.positions.miku, 223.075);
    assert.equal(session.positions.unknown, undefined);
  });
  await it("both directions wrap the two-track list", () => {
    assert.equal(adjacentTrack("quiet-morning", -1).id, "miku");
    assert.equal(adjacentTrack("quiet-morning", 1).id, "miku");
    assert.equal(adjacentTrack("miku", 1).id, "quiet-morning");
  });
  await it("keeps restored end positions seekable and formats short and long tracks", () => {
    assert.equal(clampPosition(16, 16), 15.95);
    assert.equal(clampPosition(Number.NaN, 16), 0);
    assert.equal(formatPlaybackTime(223.125), "3:43");
    assert.equal(formatPlaybackTime(6.25), "0:06");
  });
});
