import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  guestbookEntriesSchema,
  guestbookSubmissionSchema,
} from "./display-content.schema";

await describe("local guestbook validation", async () => {
  await it("trims public text, accepts optional email, and rejects empty or invalid submissions", () => {
    assert.deepEqual(
      guestbookSubmissionSchema.parse({
        name: "  Mira  ",
        email: "",
        message: "  A little hello.  ",
      }),
      { name: "Mira", email: "", message: "A little hello." },
    );
    for (const input of [
      { name: "Mira", email: "not-an-email", message: "Hello" },
      { name: "Mira", email: "", message: "  " },
      { name: "Mira", email: "", message: "x".repeat(501) },
    ])
      assert.equal(guestbookSubmissionSchema.safeParse(input).success, false);
    assert.deepEqual(
      guestbookSubmissionSchema.parse({
        name: "  ",
        email: "",
        message: "Hello",
      }),
      { name: "", email: "", message: "Hello" },
    );
  });
  await it("rejects malformed saved entries and bounds retained local messages", () => {
    const entry = {
      id: "one",
      name: "Mira",
      email: "mira@example.test",
      message: "Hello desk",
      date: "2026-09-13T00:00:00.000Z",
    };
    assert.equal(guestbookEntriesSchema.safeParse([entry]).success, true);
    for (const githubUsername of ["", "ech0xff"]) {
      assert.equal(
        guestbookEntriesSchema.safeParse([{ ...entry, githubUsername }])
          .success,
        true,
      );
    }
    assert.equal(
      guestbookSubmissionSchema.parse({ ...entry, githubUsername: " ech0xff " })
        .githubUsername,
      "ech0xff",
    );
    for (const githubUsername of [
      "muyu258@icloud.com",
      "https://github.com/ech0xff",
      "a--b",
    ]) {
      assert.equal(
        guestbookSubmissionSchema.safeParse({ ...entry, githubUsername })
          .success,
        false,
      );
    }
    assert.equal(
      guestbookEntriesSchema.safeParse([{ ...entry, date: "invalid" }]).success,
      false,
    );
    assert.equal(
      guestbookEntriesSchema.safeParse(Array.from({ length: 51 }, () => entry))
        .success,
      false,
    );
  });
});
