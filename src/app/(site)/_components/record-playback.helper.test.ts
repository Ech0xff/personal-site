import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { cyclePlaybackMode, nextRecordTrack } from "./record-playback.helper";

await describe("record playback modes", async () => {
  await it("cycles all modes and keeps manual skipping available in repeat-one", () => {
    assert.equal(cyclePlaybackMode("repeat-all"), "repeat-one");
    assert.equal(cyclePlaybackMode("repeat-one"), "shuffle");
    assert.equal(cyclePlaybackMode("shuffle"), "repeat-all");
    assert.equal(
      nextRecordTrack("miku", "repeat-one", 1, 0).id,
      "quiet-morning",
    );
    assert.equal(
      nextRecordTrack("quiet-morning", "repeat-all", -1, 0).id,
      "miku",
    );
  });
  await it("shuffle excludes the current track even at the random range boundaries", () => {
    for (const random of [0, 0.5, 0.999999, 1]) {
      assert.equal(
        nextRecordTrack("miku", "shuffle", 1, random).id,
        "quiet-morning",
      );
      assert.equal(
        nextRecordTrack("quiet-morning", "shuffle", 1, random).id,
        "miku",
      );
    }
  });
});
