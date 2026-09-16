import { expect, test } from "bun:test";
import { runInNewContext } from "node:vm";

import { createThemeScript } from "./theme-script.helper";

function paintTheme(
  stored: string | null,
  systemDark: boolean,
  storageFails = false,
) {
  const attributes = new Map<string, string>();
  const classes = new Set(["root", "dark-colors", "light-colors"]);
  const style = { colorScheme: "" };
  runInNewContext(createThemeScript(["dark-colors"], ["light-colors"]), {
    localStorage: {
      getItem: (key: string) => {
        expect(key).toBe("theme");
        if (storageFails) throw new Error("Storage unavailable");
        return stored;
      },
    },
    matchMedia: (query: string) => {
      expect(query).toBe("(prefers-color-scheme: dark)");
      return { matches: systemDark };
    },
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
    theme: attributes.get("data-theme"),
    preference: attributes.get("data-theme-preference"),
    colorScheme: style.colorScheme,
    classes: [...classes],
  };
}

test("saved preferences override the system without removing unrelated classes", () => {
  for (const theme of ["light", "dark"]) {
    expect(paintTheme(theme, theme === "light")).toEqual({
      theme,
      preference: theme,
      colorScheme: theme,
      classes: ["root", `${theme}-colors`],
    });
  }
});

test("missing, invalid and inaccessible storage fall back to the system", () => {
  for (const systemDark of [true, false]) {
    const theme = systemDark ? "dark" : "light";
    for (const stored of [null, "invalid", "system"]) {
      expect(paintTheme(stored, systemDark)).toMatchObject({
        theme,
        preference: "system",
      });
    }
    expect(paintTheme("light", systemDark, true)).toMatchObject({
      theme,
      preference: "system",
    });
  }
});
