import assert from "node:assert/strict";
import { describe, test } from "node:test";

import { createT, dictionaries } from ".";

describe("typed translator", () => {
  test("selects and interpolates messages", () => {
    const t = createT(dictionaries["en-US"], "en-US");

    assert.equal(
      t((d) => d.auth.signIn),
      "Sign In",
    );
    assert.equal(
      t((d) => d.auth.continueWith, {
        provider: "GitHub",
      }),
      "Continue with GitHub",
    );

    const home = t((d) => d.home);
    assert.deepEqual(home.typing, ["echo 'Hello World!'"]);
  });

  test("formats ICU plurals for each locale", () => {
    const en = createT(dictionaries["en-US"], "en-US");
    const zh = createT(dictionaries["zh-CN"], "zh-CN");

    assert.equal(
      en((d) => d.indexHome.recentActivity.recordCount, {
        count: 1,
      }),
      "1 record",
    );
    assert.equal(
      en((d) => d.indexHome.recentActivity.recordCount, {
        count: 2,
      }),
      "2 records",
    );
    assert.match(
      zh((d) => d.indexHome.recentActivity.recordCount, {
        count: 2,
      }),
      /2/,
    );
  });

  test("formats rich tags", () => {
    const t = createT(dictionaries["en-US"], "en-US");
    const value = t.rich((d) => d.indexEvents.description, {
      total: 3,
      b: () => "[3]",
    });

    assert.equal(
      value,
      "A timeline of memorable moments and milestones. Total [3] events recorded, documenting the journey.",
    );
  });
});
