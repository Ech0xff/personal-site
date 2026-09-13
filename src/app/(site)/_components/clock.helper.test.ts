import assert from "node:assert/strict";
import { test } from "node:test";

import { formatClock } from "./clock.helper";

await test("clock handles midnight, noon and padded seconds in both formats", () => {
  const midnight = new Date(2026, 8, 13, 0, 4, 9);
  const noon = new Date(2026, 8, 13, 12, 0, 0);
  const evening = new Date(2026, 8, 13, 21, 8, 36);
  assert.equal(formatClock(midnight, "24h"), "00:04:09");
  assert.equal(formatClock(midnight, "12h"), "12:04:09 AM");
  assert.equal(formatClock(noon, "12h"), "12:00:00 PM");
  assert.equal(formatClock(evening, "12h"), "09:08:36 PM");
  assert.equal(formatClock(evening, "24h"), "21:08:36");
});
