import { describe, expect, test } from "bun:test";

import { prepareMigration, type Sql } from "./simplify-database";

const content = {
  items: [
    {
      id: "saved-record",
      type: "record",
      name: "Saved music",
      config: { tracks: [] },
    },
  ],
};
const layout = {
  ...content,
  items: content.items.map((item) => ({
    ...item,
    appearance: { rotation: -4 },
  })),
  layouts: { desktop: { width: 1440, height: 900, placements: {} } },
};
const databaseWith =
  (configs: readonly { key: string; value: unknown }[]): Sql =>
  async (source) => {
    if (source.includes("to_regclass('public.audio_assets')")) return "f";
    if (source.startsWith("SELECT jsonb_build_object"))
      return JSON.stringify({ posts: [], audio: [], configs });
    if (source.includes("information_schema.columns")) return "0";
    throw new Error(`Unexpected preflight query: ${source}`);
  };

describe("desk configuration migration preflight", () => {
  test("detects layout-only work after the earlier database migration", async () => {
    const migration = await prepareMigration(
      databaseWith([{ key: "desk.configuration", value: layout }]),
    );

    expect(migration.needed).toBe(true);
    expect(migration.snapshot.configs[0].value).toEqual(layout);
  });

  test("does not migrate null defaults or content-only configurations again", async () => {
    for (const value of [null, content]) {
      const migration = await prepareMigration(
        databaseWith([{ key: "desk.configuration", value }]),
      );
      expect(migration.needed).toBe(false);
    }
  });

  test("rejects conflicting slots before any writes or backup", async () => {
    const result = await prepareMigration(
      databaseWith([
        {
          key: "desk.configuration",
          value: {
            items: [content.items[0], { ...content.items[0], id: "duplicate" }],
          },
        },
      ]),
    ).then(
      () => "accepted",
      (error) => String(error),
    );
    expect(result).toContain("Each desk item type can only appear once.");
  });

  test("keeps the existing saved content ahead of an obsolete workspace draft", async () => {
    const migration = await prepareMigration(
      databaseWith([
        { key: "desk.configuration", value: content },
        { key: "desk.workspace", value: { draft: { items: [] } } },
      ]),
    );

    expect(migration.needed).toBe(true);
    expect(migration.snapshot.configs[0].value).toEqual(content);
  });

  test("validates the published workspace instead of its unpublished draft", async () => {
    const migration = await prepareMigration(
      databaseWith([
        {
          key: "desk.workspace",
          value: { published: layout, draft: { items: [] } },
        },
      ]),
    );

    expect(migration.needed).toBe(true);
  });
});
