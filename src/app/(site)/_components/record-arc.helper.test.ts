import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { arcPoint, arcProgress } from "./record-arc.helper";

await describe("record arc seeking", async () => {
  await it("maps the lower arc from left to right through its midpoint", () => {
    for (const progress of [0, 0.25, 0.5, 0.75, 1]) {
      const { x, y } = arcPoint(progress);
      assert.ok(y > 120);
      assert.ok(Math.abs(arcProgress(x, y) - progress) < 0.00001);
    }
    assert.equal(arcProgress(120, 211), 0.5);
  });
  await it("clamps a captured drag beyond the ends instead of wrapping playback", () => {
    assert.equal(arcProgress(0, 120), 0);
    assert.equal(arcProgress(240, 120), 1);
    assert.equal(arcProgress(240, 80), 1);
    assert.equal(arcProgress(0, 80), 0);
  });
});
