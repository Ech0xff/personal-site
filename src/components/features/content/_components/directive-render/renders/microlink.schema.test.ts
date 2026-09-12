import assert from "node:assert/strict";
import test from "node:test";

import { parseMicrolinkResponse } from "./microlink.schema";

await test("keeps Apple Music metadata when the API has no description", () => {
  const payload = {
    status: "success",
    data: {
      title: "YAMINIFURUAME - Apple Music",
      description: null,
      publisher: "apple.com",
      url: "https://music.apple.com/us/album/1755152188?i=1755152189",
      image: {
        url: "https://music.apple.com/assets/app-icons/onboarding_appicon_fy2020.png",
      },
      logo: { url: "https://www.apple.com/bimi/v2/apple.svg" },
    },
  };

  assert.deepEqual(parseMicrolinkResponse(payload), payload);
});

await test("accepts absent or null optional metadata for card fallbacks", () => {
  const data = {
    title: null,
    description: null,
    publisher: null,
    image: null,
    logo: null,
  };

  assert.deepEqual(
    parseMicrolinkResponse({ status: "success", data }).data,
    data,
  );
  assert.deepEqual(
    parseMicrolinkResponse({ status: "success", data: {} }).data,
    {},
  );
});

await test("still rejects malformed metadata instead of rendering invalid values", () => {
  for (const data of [
    { description: 123 },
    { image: "https://example.com/image.png" },
    { logo: { url: 123 } },
  ]) {
    assert.throws(() => parseMicrolinkResponse({ status: "success", data }));
  }
});
