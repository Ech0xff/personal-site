import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { getGuestbookAvatarUrl } from "./guestbook-avatar.helper";

await describe("GitHub guestbook avatars", async () => {
  await it("uses only a valid GitHub username to construct the account image URL", () => {
    assert.equal(
      getGuestbookAvatarUrl(" ech0xff "),
      "https://github.com/ech0xff.png?size=64",
    );
    assert.equal(
      getGuestbookAvatarUrl("a-b"),
      "https://github.com/a-b.png?size=64",
    );
    assert.equal(
      getGuestbookAvatarUrl("a".repeat(39)),
      `https://github.com/${"a".repeat(39)}.png?size=64`,
    );
  });
  await it("falls back for missing usernames, emails, URLs, and malformed account names", () => {
    for (const value of [
      undefined,
      "",
      "  ",
      "muyu258@icloud.com",
      "https://github.com/ech0xff",
      "../ech0xff",
      "-user",
      "user-",
      "a--b",
      "user_name",
      "a".repeat(40),
    ]) {
      assert.equal(getGuestbookAvatarUrl(value), null);
    }
  });
});
