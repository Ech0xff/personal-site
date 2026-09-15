import { describe, expect, test } from "bun:test";
import { runInNewContext } from "node:vm";

import { createStore } from "jotai";

// oxlint-disable-next-line no-restricted-imports -- Client state regressions stay in the existing browser behavior suite.
import { createDeskEditorAtoms } from "#lib/client/desk/desk-editor.atom";
// oxlint-disable-next-line no-restricted-imports -- Browser regression coverage stays in the existing theme initialization suite.
import { lockScrolling } from "#lib/client/scroll/scroll-lock.service";

import { defaultDeskConfiguration } from "../desk/desk-defaults.const";
import {
  deskItemSchema,
  restoreDeskItemContent,
} from "../desk/desk-item.schema";
import {
  replaceDeskItem,
  layoutDesk,
  overlaps,
  shuffleDesk,
} from "../desk/desk-layout.helper";
import { createThemeScript } from "./theme-script.helper";

test("overlapping navigation and dialog locks restore the original scroll state", () => {
  const body = { style: { overflow: "auto" } };
  const endNavigation = lockScrolling(body);
  const closeDialog = lockScrolling(body);
  endNavigation();
  expect(body.style.overflow).toBe("hidden");
  endNavigation();
  expect(body.style.overflow).toBe("hidden");
  closeDialog();
  expect(body.style.overflow).toBe("auto");
  const nextDialog = lockScrolling(body);
  const nextNavigation = lockScrolling(body);
  nextDialog();
  expect(body.style.overflow).toBe("hidden");
  nextNavigation();
  expect(body.style.overflow).toBe("auto");
});

function paintTheme(
  stored: string | null,
  systemDark: boolean,
  storageFails = false,
) {
  const dark = [
    "dark-colors",
    "dark-shadows",
    "dark-materials",
    "dark-lighting",
  ];
  const light = [
    "light-colors",
    "light-shadows",
    "light-materials",
    "light-lighting",
  ];
  const attributes = new Map<string, string>();
  const classes = new Set(["root-layout", ...dark, ...light]);
  const style = { colorScheme: "" };
  runInNewContext(createThemeScript(dark, light), {
    localStorage: {
      getItem: () => {
        if (storageFails) throw new Error("Storage unavailable");
        return stored;
      },
    },
    matchMedia: () => ({ matches: systemDark }),
    document: {
      documentElement: {
        style,
        setAttribute: (key: string, value: string) =>
          attributes.set(key, value),
        classList: {
          toggle: (name: string, enabled: boolean) =>
            enabled ? classes.add(name) : classes.delete(name),
        },
      },
    },
  });
  return {
    preference: attributes.get("data-theme-preference"),
    theme: attributes.get("data-theme"),
    colorScheme: style.colorScheme,
    classes: [...classes],
  };
}

describe("shared pre-paint theme", () => {
  test("a saved light preference overrides a dark system and preserves unrelated root classes", () => {
    expect(paintTheme("light", true)).toEqual({
      preference: "light",
      theme: "light",
      colorScheme: "light",
      classes: [
        "root-layout",
        "light-colors",
        "light-shadows",
        "light-materials",
        "light-lighting",
      ],
    });
  });
  test("a saved dark preference applies all dark overrides before hydration", () => {
    expect(paintTheme("dark", false)).toEqual({
      preference: "dark",
      theme: "dark",
      colorScheme: "dark",
      classes: [
        "root-layout",
        "dark-colors",
        "dark-shadows",
        "dark-materials",
        "dark-lighting",
      ],
    });
  });
  test("missing and invalid preferences follow the system", () => {
    for (const stored of [null, "invalid", "system"]) {
      expect(paintTheme(stored, false).theme).toBe("light");
      expect(paintTheme(stored, true).theme).toBe("dark");
      expect(paintTheme(stored, true).preference).toBe("system");
    }
  });
  test("blocked storage still paints the system appearance", () => {
    expect(paintTheme("light", true, true).theme).toBe("dark");
    expect(paintTheme("dark", false, true).classes).toEqual([
      "root-layout",
      "light-colors",
      "light-shadows",
      "light-materials",
      "light-lighting",
    ]);
  });
});

describe("deterministic display timezone", () => {
  test("missing and invalid settings use the same explicit default on server and client", async () => {
    const { resolveAppTimeZone } = await import("../utils/date.helper");
    for (const value of [undefined, "", "  ", "Invalid/Timezone"]) {
      expect(resolveAppTimeZone(value)).toBe("America/New_York");
    }
    expect(resolveAppTimeZone("Asia/Shanghai")).toBe("Asia/Shanghai");
  });
});

test("desk persistence rejects overlapping saves and records only successful changes", async () => {
  const initial = defaultDeskConfiguration;
  const changed = {
    ...initial,
    items: initial.items.map((item, index) =>
      index === 0 ? { ...item, name: "Changed" } : item,
    ),
  };
  const pending = Promise.withResolvers<{ ok: false; error: string }>();
  let calls = 0;
  const atoms = createDeskEditorAtoms(initial, async (next) => {
    calls += 1;
    if (calls === 1) return pending.promise;
    return { ok: true, data: next };
  });
  const store = createStore();
  const first = store.set(atoms.save, changed);
  expect(store.get(atoms.saving).status).toBe("saving");
  expect(await store.set(atoms.save, changed)).toBe(false);
  expect(calls).toBe(1);
  expect(store.get(atoms.configuration)).toBe(initial);
  pending.resolve({ ok: false, error: "Session expired" });
  expect(await first).toBe(false);
  expect(store.get(atoms.configuration)).toBe(initial);
  expect(store.get(atoms.history).entries).toHaveLength(1);
  expect(store.get(atoms.saving)).toEqual({
    status: "error",
    error: "Session expired",
  });
  expect(await store.set(atoms.save, changed)).toBe(true);
  expect(store.get(atoms.configuration)).toEqual(changed);
  expect(store.get(atoms.history).index).toBe(1);
  expect(await store.set(atoms.save, changed)).toBe(true);
  expect(
    await store.set(atoms.save, {
      layouts: changed.layouts,
      items: changed.items,
    }),
  ).toBe(true);
  expect(calls).toBe(2);
  expect(store.get(atoms.history).entries).toHaveLength(2);
});

test("desk undo and redo persist and a new edit truncates redo history", async () => {
  const writes: unknown[] = [];
  const initial = defaultDeskConfiguration;
  const atoms = createDeskEditorAtoms(initial, async (next) => {
    writes.push(next);
    return { ok: true, data: next };
  });
  const store = createStore();
  const changed = {
    ...initial,
    items: initial.items.map((item, index) =>
      index === 0 ? { ...item, name: "Second" } : item,
    ),
  };
  await store.set(atoms.save, changed);
  await store.set(atoms.save, initial, 0);
  expect(store.get(atoms.history).index).toBe(0);
  await store.set(atoms.save, changed, 1);
  expect(store.get(atoms.history).entries).toHaveLength(2);
  await store.set(atoms.save, initial, 0);
  const alternate = {
    ...changed,
    items: changed.items.map((item, index) =>
      index === 0 ? { ...item, name: "Third" } : item,
    ),
  };
  await store.set(atoms.save, alternate);
  expect(store.get(atoms.history).entries).toEqual([initial, alternate]);
  expect(writes).toEqual([changed, initial, changed, initial, alternate]);
});

test("legacy items receive appearance defaults and calendar date is derived", () => {
  const parsed = deskItemSchema.parse({
    id: "calendar",
    type: "calendar",
    name: "Events",
    config: { heading: "Today", month: "JANUARY", day: "1", caption: "Hello" },
  });
  expect(parsed.appearance.rotation).toBe(-7);
  expect(parsed.config).toEqual({ heading: "Today", caption: "Hello" });
  expect(
    deskItemSchema.safeParse({
      ...parsed,
      appearance: { ...parsed.appearance, minScale: 1.5, maxScale: 0.8 },
    }).success,
  ).toBe(false);
});

test("item changes share appearance while scaling only the selected breakpoint", () => {
  const initial = defaultDeskConfiguration;
  const item = initial.items.find((entry) => entry.type === "books")!;
  const changed = {
    ...item,
    name: "Reading",
    appearance: { ...item.appearance, rotation: 12 },
  };
  const next = replaceDeskItem(initial, changed, "phone", 1.2);
  expect(next.items.find((entry) => entry.id === item.id)).toEqual(changed);
  expect(next.layouts.phone.placements[item.id].scale).toBe(1.2);
  expect(next.layouts.desktop).toEqual(initial.layouts.desktop);
  expect(next.layouts.tablet).toEqual(initial.layouts.tablet);
  const bounded = replaceDeskItem(
    next,
    { ...changed, appearance: { ...changed.appearance, maxScale: 0.9 } },
    "desktop",
    0.9,
  );
  expect(bounded.layouts.phone.placements[item.id].scale).toBe(0.9);
  expect(initial.layouts.phone.placements[item.id].scale).toBe(1);
});

test("dragging capability controls visitor placement and shuffle", () => {
  const initial = defaultDeskConfiguration;
  const coffee = initial.items.find((item) => item.type === "coffee")!;
  const fixed = {
    ...coffee,
    appearance: { ...coffee.appearance, draggable: false },
  };
  const layout = initial.layouts.desktop;
  const viewport = { width: layout.width, height: layout.height };
  const items = initial.items.map((item) =>
    item.id === fixed.id ? fixed : item,
  );
  const placed = layoutDesk(
    items,
    layout,
    viewport,
    {},
    { ...viewport, positions: { coffee: { x: 0, y: 0 } } },
  );
  const original = placed.find((entry) => entry.item.id === fixed.id)!;
  expect(original.box.x).toBe(layout.placements.coffee.x);
  expect(original.box.y).toBe(layout.placements.coffee.y);
  const shuffled = shuffleDesk(placed, viewport, 42);
  expect(shuffled.find((entry) => entry.item.id === fixed.id)?.box).toEqual(
    original.box,
  );
  const movableIntro = initial.items.map((item) =>
    item.type === "intro"
      ? { ...item, appearance: { ...item.appearance, draggable: true } }
      : item,
  );
  const withPosition = {
    ...layout,
    placements: { ...layout.placements, intro: { x: 450, y: 420, scale: 1 } },
  };
  const intro = layoutDesk(movableIntro, withPosition, viewport, {}).find(
    (entry) => entry.item.type === "intro",
  )!;
  expect(intro.box.y).toBeGreaterThanOrEqual(420);
});

test("restoring content preserves common attributes, including unfinished appearance input", () => {
  const initial = defaultDeskConfiguration.items.find(
    (item) => item.type === "display",
  )!;
  const edited = {
    ...initial,
    name: "",
    config: { terminalLines: ["Custom"] },
    appearance: { ...initial.appearance, maxScale: 0 },
  };
  const restored = restoreDeskItemContent(edited);
  expect(restored.config).toEqual(initial.config);
  expect(restored.name).toBe("");
  expect(restored.appearance.maxScale).toBe(0);
  expect(edited.config.terminalLines).toEqual(["Custom"]);
});

test("fixed objects keep their exact placements when other items collide or grow", () => {
  const defaults = defaultDeskConfiguration;
  const fixed = defaults.items.find((item) => item.type === "coffee")!;
  const movable = defaults.items.find((item) => item.type === "display")!;
  const locked = {
    ...fixed,
    appearance: { ...fixed.appearance, draggable: false },
  };
  const layout = {
    width: 1440,
    height: 900,
    placements: {
      coffee: { x: 600, y: 300, scale: 1 },
      display: { x: 600, y: 300, scale: 1 },
    },
  };
  const viewport = { width: 1440, height: 900 };
  const first = layoutDesk([movable, locked], layout, viewport, {});
  const grown = layoutDesk([locked, movable], layout, viewport, {
    display: { width: 300, height: 800 },
  });
  expect(first.find((entry) => entry.item.id === locked.id)?.box).toEqual(
    grown.find((entry) => entry.item.id === locked.id)?.box,
  );
  expect(grown.find((entry) => entry.item.id === locked.id)?.box).toMatchObject(
    { x: 600, y: 300 },
  );
  expect(overlaps(grown[0].box, grown[1].box)).toBe(false);
  const intro = defaults.items.find((item) => item.type === "intro")!;
  const positioned = layoutDesk(
    [intro, movable],
    {
      ...layout,
      placements: { ...layout.placements, intro: { x: 430, y: 350, scale: 1 } },
    },
    viewport,
    {},
  );
  expect(
    positioned.find((entry) => entry.item.id === intro.id)?.box,
  ).toMatchObject({ x: 430, y: 350 });
});

test("locking an item persists its resolved position rather than an older reference", () => {
  const defaults = defaultDeskConfiguration;
  const item = defaults.items.find((entry) => entry.type === "books")!;
  const fixed = {
    ...item,
    appearance: { ...item.appearance, draggable: false },
  };
  const next = replaceDeskItem(defaults, fixed, "desktop", 1, {
    x: 425,
    y: 280,
    scale: 1,
  });
  expect(next.layouts.desktop.placements[item.id]).toEqual({
    x: 425,
    y: 280,
    scale: 1,
  });
  expect(next.layouts.phone).toEqual(defaults.layouts.phone);
});

test("the initial desktop composition keeps the original corners and bottom row", () => {
  const configuration = defaultDeskConfiguration;
  for (const height of [900, 924, 1124]) {
    const entries = layoutDesk(
      configuration.items,
      configuration.layouts.desktop,
      { width: 1440, height },
      {
        intro: { width: 560, height: 375 },
        record: { width: 320, height: 260 },
        books: { width: 214, height: 264 },
        calendar: { width: 125, height: 158 },
      },
    );
    const box = (id: string) =>
      entries.find((entry) => entry.item.id === id)!.box;
    expect(box("display").x + box("display").width).toBeLessThan(
      box("intro").x,
    );
    expect(box("record").x).toBeGreaterThan(
      box("intro").x + box("intro").width,
    );
    expect(box("books").x).toBeLessThan(box("intro").x);
    expect(box("letter").x).toBeGreaterThan(
      box("intro").x + box("intro").width,
    );
    for (const id of ["books", "letter", "calendar", "coffee"]) {
      expect(box(id).y).toBeGreaterThan(height / 2);
    }
    expect(box("intro").y + box("intro").height / 2).toBeCloseTo(height * 0.48);
    for (const [index, entry] of entries.entries()) {
      expect(entry.box.y + entry.box.height).toBeLessThanOrEqual(height);
      expect(
        entries
          .slice(index + 1)
          .some((other) => overlaps(entry.box, other.box)),
      ).toBe(false);
    }
  }
});
