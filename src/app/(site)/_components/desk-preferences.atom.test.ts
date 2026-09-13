import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { createStore } from "jotai";

import {
  clockFormatAtom,
  lampOnAtom,
  playbackModeAtom,
  displayProgramAtom,
  deskLikedAtom,
  guestbookDraftAtom,
  guestbookEntriesAtom,
  guestbookTabAtom,
  recordControlsPinnedAtom,
  recordSessionAtom,
} from "./desk-preferences.atom";
import { recordStorageKey } from "./record-session.helper";

await describe("desk preference persistence", async () => {
  await it("restores old entries, keeps pin independent, and persists changes across stores", () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "localStorage",
    );
    const values = new Map([
      [
        recordStorageKey,
        JSON.stringify({
          version: 1,
          trackId: "miku",
          positions: { miku: 42, "quiet-morning": 6 },
        }),
      ],
      ["redesign:clock-format:v1", "12h"],
    ]);
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => values.get(key) ?? null,
        setItem: (key: string, value: string) => values.set(key, value),
        removeItem: (key: string) => values.delete(key),
      },
    });
    try {
      const store = createStore();
      assert.equal(store.get(recordSessionAtom).trackId, "quiet-morning");
      const release = [
        store.sub(recordSessionAtom, () => {}),
        store.sub(recordControlsPinnedAtom, () => {}),
        store.sub(clockFormatAtom, () => {}),
        store.sub(lampOnAtom, () => {}),
        store.sub(playbackModeAtom, () => {}),
        store.sub(displayProgramAtom, () => {}),
        store.sub(deskLikedAtom, () => {}),
        store.sub(guestbookDraftAtom, () => {}),
        store.sub(guestbookEntriesAtom, () => {}),
        store.sub(guestbookTabAtom, () => {}),
      ];
      const restored = store.get(recordSessionAtom);
      assert.equal(restored.trackId, "miku");
      assert.equal(restored.positions.miku, 42);
      assert.equal(store.get(clockFormatAtom), "12h");
      store.set(recordControlsPinnedAtom, true);
      assert.deepEqual(store.get(recordSessionAtom), restored);
      store.set(recordSessionAtom, {
        ...restored,
        positions: { ...restored.positions, miku: 55 },
      });
      store.set(clockFormatAtom, "24h");
      store.set(lampOnAtom, false);
      store.set(playbackModeAtom, "shuffle");
      store.set(displayProgramAtom, "guestbook");
      store.set(deskLikedAtom, true);
      store.set(guestbookDraftAtom, {
        name: "Mira",
        email: "mira@example.test",
        githubUsername: "ech0xff",
        message: "A draft",
      });
      store.set(guestbookEntriesAtom, [
        {
          id: "one",
          name: "Mira",
          email: "mira@example.test",
          githubUsername: "ech0xff",
          message: "A saved note",
          date: "2026-09-13T00:00:00.000Z",
        },
      ]);
      store.set(guestbookTabAtom, "write");
      assert.equal(
        values.get("redesign:clock-format:v1"),
        JSON.stringify("24h"),
      );
      release.forEach((unsubscribe) => unsubscribe());

      const reload = createStore();
      const unmount = [
        reload.sub(recordSessionAtom, () => {}),
        reload.sub(recordControlsPinnedAtom, () => {}),
        reload.sub(clockFormatAtom, () => {}),
        reload.sub(lampOnAtom, () => {}),
        reload.sub(playbackModeAtom, () => {}),
        reload.sub(displayProgramAtom, () => {}),
        reload.sub(deskLikedAtom, () => {}),
        reload.sub(guestbookDraftAtom, () => {}),
        reload.sub(guestbookEntriesAtom, () => {}),
        reload.sub(guestbookTabAtom, () => {}),
      ];
      assert.equal(reload.get(recordControlsPinnedAtom), true);
      assert.deepEqual(reload.get(recordSessionAtom).positions, {
        "quiet-morning": 6,
        miku: 55,
      });
      assert.equal(reload.get(clockFormatAtom), "24h");
      assert.equal(reload.get(lampOnAtom), false);
      assert.equal(reload.get(playbackModeAtom), "shuffle");
      assert.equal(reload.get(displayProgramAtom), "guestbook");
      assert.equal(reload.get(deskLikedAtom), true);
      assert.equal(reload.get(guestbookDraftAtom).message, "A draft");
      assert.equal(reload.get(guestbookDraftAtom).githubUsername, "ech0xff");
      assert.equal(
        reload.get(guestbookEntriesAtom)[0].githubUsername,
        "ech0xff",
      );
      assert.equal(reload.get(guestbookEntriesAtom)[0].message, "A saved note");
      assert.equal(reload.get(guestbookTabAtom), "write");
      unmount.forEach((unsubscribe) => unsubscribe());
    } finally {
      if (descriptor)
        Object.defineProperty(globalThis, "localStorage", descriptor);
      else Reflect.deleteProperty(globalThis, "localStorage");
    }
  });

  await it("keeps preferences usable when browser storage throws", () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "localStorage",
    );
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      get: () => {
        throw new Error("Storage unavailable");
      },
    });
    try {
      const store = createStore();
      const unsubscribe = store.sub(recordControlsPinnedAtom, () => {});
      assert.equal(store.get(recordControlsPinnedAtom), false);
      store.set(recordControlsPinnedAtom, true);
      assert.equal(store.get(recordControlsPinnedAtom), true);
      unsubscribe();
    } finally {
      if (descriptor)
        Object.defineProperty(globalThis, "localStorage", descriptor);
      else Reflect.deleteProperty(globalThis, "localStorage");
    }
  });
});
