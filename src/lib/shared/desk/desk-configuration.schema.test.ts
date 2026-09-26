import { describe, expect, test } from "bun:test";

import {
  deskConfigurationSchema,
  type DeskConfiguration,
  type DeskItem,
} from "./desk-configuration.schema";
import { defaultDeskConfiguration } from "./desk-defaults.const";

describe("desk content configuration", () => {
  test("removes saved geometry without changing content or item identity", () => {
    const items = [
      {
        id: "reading-list",
        type: "books",
        name: "My reading list",
        config: { eyebrow: "Notes", title: "随手记", author: "Ech0xff" },
      },
      {
        id: "music-library",
        type: "record",
        name: "Listening",
        config: {
          tracks: [
            { assetId: "second", title: "Track two", artist: "Artist B" },
            { assetId: "first", title: "Track one", artist: "Artist A" },
          ],
        },
      },
    ] satisfies DeskItem[];
    const saved = {
      items: items.map((item) => ({
        ...item,
        appearance: { draggable: true, offsetX: 24, rotation: -8 },
      })),
      layouts: {
        desktop: { placements: { "reading-list": { x: 20, y: 30 } } },
      },
    };

    expect(deskConfigurationSchema.parse(saved)).toEqual({ items });
    expect(saved.items[0].appearance.offsetX).toBe(24);
  });

  test("keeps omitted slots and an explicitly empty playlist empty", () => {
    const configuration = {
      items: [
        { id: "record", type: "record", name: "Music", config: { tracks: [] } },
      ],
    } satisfies DeskConfiguration;

    expect(deskConfigurationSchema.parse(configuration)).toEqual(configuration);
  });

  test("rejects duplicate slots and duplicate identities", () => {
    const [display, intro] = defaultDeskConfiguration.items;
    expect(
      deskConfigurationSchema.safeParse({
        items: [display, { ...display, id: "another-display" }],
      }).success,
    ).toBe(false);
    expect(
      deskConfigurationSchema.safeParse({
        items: [display, { ...intro, id: display.id }],
      }).success,
    ).toBe(false);
  });
});
