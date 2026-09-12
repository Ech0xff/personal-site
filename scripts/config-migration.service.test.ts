import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { planConfigMigration } from "./config-migration.service";

await describe("English config migration", async () => {
  await test("copies the English values without changing source rows", () => {
    const rows = Object.freeze([
      Object.freeze({ key: "ABOUT_ME:en-US", value: "Original English bio" }),
      Object.freeze({ key: "ABOUT_ME:zh-CN", value: "原文" }),
      Object.freeze({ key: "PLAYLIST_URL:en-US", value: "" }),
      Object.freeze({ key: "RECENT_PLAN:en-US", value: [] }),
      Object.freeze({
        key: "DICTIONARY:en-US",
        value: { home: { hero: "My site" } },
      }),
    ]);

    assert.deepEqual(planConfigMigration(rows), [
      {
        key: "DICTIONARY",
        source: "DICTIONARY:en-US",
        state: "ready",
        value: { home: { hero: "My site" } },
      },
      {
        key: "ABOUT_ME",
        source: "ABOUT_ME:en-US",
        state: "ready",
        value: "Original English bio",
      },
      {
        key: "PLAYLIST_URL",
        source: "PLAYLIST_URL:en-US",
        state: "ready",
        value: "",
      },
      {
        key: "RECENT_PLAN",
        source: "RECENT_PLAN:en-US",
        state: "ready",
        value: [],
      },
    ]);
    assert.equal(rows[0].key, "ABOUT_ME:en-US");
    assert.equal(rows[1].value, "原文");
  });

  await test("preserves existing targets, including empty values", () => {
    const plan = planConfigMigration([
      { key: "ABOUT_ME", value: "" },
      { key: "ABOUT_ME:en-US", value: "Old bio" },
    ]);
    assert.equal(plan.find(({ key }) => key === "ABOUT_ME")?.state, "existing");
    assert.equal(plan.filter(({ state }) => state === "ready").length, 0);
  });

  await test("does not substitute another language or historical key", () => {
    const plan = planConfigMigration([
      { key: "ABOUT_ME:zh-CN", value: "原文" },
      { key: "aboutMe:en_US", value: "Older bio" },
    ]);
    assert.equal(
      plan.every(({ state }) => state === "missing"),
      true,
    );
  });

  await test("rejects incompatible values before any migration can start", () => {
    assert.throws(() =>
      planConfigMigration([
        { key: "ABOUT_ME:en-US", value: "Valid bio" },
        { key: "DICTIONARY:en-US", value: { removedField: "Old value" } },
      ]),
    );
    assert.throws(() =>
      planConfigMigration([{ key: "RECENT_PLAN", value: "Invalid target" }]),
    );
  });
});
