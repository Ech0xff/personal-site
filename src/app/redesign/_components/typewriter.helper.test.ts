import assert from "node:assert/strict";
import test from "node:test";

import { advanceTypewriter, initialTypewriterState } from "./typewriter.helper";

await test("terminal types, holds, deletes, and advances without skipping characters", () => {
  let state = initialTypewriterState;
  const lines = ["Hi", "Bye"];
  state = advanceTypewriter(state, lines);
  assert.deepEqual(state, { line: 0, count: 1, phase: "typing" });
  state = advanceTypewriter(state, lines);
  state = advanceTypewriter(state, lines);
  assert.deepEqual(state, { line: 0, count: 2, phase: "holding" });
  state = advanceTypewriter(state, lines);
  assert.equal(state.phase, "deleting");
  state = advanceTypewriter(state, lines);
  state = advanceTypewriter(state, lines);
  assert.equal(state.count, 0);
  state = advanceTypewriter(state, lines);
  assert.deepEqual(state, { line: 1, count: 0, phase: "typing" });
});
await test("terminal counts Unicode code points and wraps to the first message", () => {
  assert.deepEqual(
    advanceTypewriter({ line: 0, count: 1, phase: "typing" }, ["👋"]),
    { line: 0, count: 1, phase: "holding" },
  );
  assert.deepEqual(
    advanceTypewriter({ line: 1, count: 0, phase: "deleting" }, ["one", "two"]),
    initialTypewriterState,
  );
});
await test("empty input remains stable without mutating the caller", () => {
  const state = Object.freeze({ ...initialTypewriterState });
  assert.deepEqual(advanceTypewriter(state, []), state);
  advanceTypewriter(state, ["Hello"]);
  assert.deepEqual(state, initialTypewriterState);
});
