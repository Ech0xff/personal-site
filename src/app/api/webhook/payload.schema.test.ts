import assert from "node:assert/strict";
import test from "node:test";

import { webhookPayloadSchema } from "./payload.schema";

const id = "123e4567-e89b-42d3-a456-426614174000";

await test("accepts post inserts, updates, deletes and the new alias", () => {
  for (const records of [
    { record: { id, content: "Post content" }, old_record: null },
    { record: { id }, old_record: { id } },
    { record: null, old_record: { id } },
    { new: { id } },
  ]) {
    assert.equal(
      webhookPayloadSchema.safeParse({ table: "posts", ...records }).success,
      true,
    );
  }
});

await test("rejects unsupported tables, invalid records and missing or invalid post IDs", () => {
  for (const payload of [
    null,
    { table: "toString" },
    { table: "__proto__" },
    { table: "unknown_table" },
    { table: "posts" },
    { table: "posts", record: [] },
    { table: "posts", record: "invalid" },
    { table: "posts", record: { id: 123 } },
    { table: "posts", record: { id: "" } },
    { table: "posts", record: { id: "not-a-uuid" } },
    { table: "posts", old_record: { id: null } },
    { table: "posts", new: { id: false } },
  ]) {
    assert.equal(
      webhookPayloadSchema.safeParse(payload).success,
      false,
      JSON.stringify(payload),
    );
  }
});

await test("accepts configs and association records without an id", () => {
  for (const table of ["configs", "post_tags", "event_tags"]) {
    assert.equal(
      webhookPayloadSchema.safeParse({ table, record: { key: "value" } })
        .success,
      true,
    );
  }
});
