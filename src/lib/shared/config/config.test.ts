import assert from "node:assert/strict";
import { describe, test } from "node:test";

import {
  CONFIG_KEY,
  CONFIG_REGISTRY,
  dictionaryOverrideSchema,
  getConfigDefaults,
} from ".";

describe("config registry", () => {
  test("provides locale-specific dictionary defaults", () => {
    assert.equal(
      getConfigDefaults(CONFIG_KEY.DICTIONARY, "en-US").meta.siteTitle,
      "Ech0xff's Little Nest",
    );
    assert.equal(
      getConfigDefaults(CONFIG_KEY.DICTIONARY, "zh-CN").meta.siteTitle,
      "Ech0xff 的小窝",
    );
  });

  test("deep-merges partial dictionary overrides", () => {
    const defaults = getConfigDefaults(CONFIG_KEY.DICTIONARY, "en-US");
    const resolved = CONFIG_REGISTRY[CONFIG_KEY.DICTIONARY].resolve(defaults, {
      navigation: { posts: "WRITING" },
    });

    assert.equal(resolved.navigation.posts, "WRITING");
    assert.equal(resolved.navigation.events, defaults.navigation.events);
  });

  test("rejects unknown dictionary fields", () => {
    assert.throws(() =>
      dictionaryOverrideSchema.parse({ meta: { unknown: "value" } }),
    );
  });
});
