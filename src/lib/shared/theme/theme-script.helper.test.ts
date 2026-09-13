import { describe, expect, test } from "bun:test";
import { runInNewContext } from "node:vm";

import { createThemeScript } from "./theme-script.helper";

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
