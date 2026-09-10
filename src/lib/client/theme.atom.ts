"use client";

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

import { Theme, themes } from "#lib/shared/theme/theme.const";
import { isTheme } from "#lib/shared/theme/theme.helper";
import {
  type ResolvedTheme,
  type PerformanceTheme,
} from "#lib/shared/theme/theme.type";

const parseTheme = (value: unknown): PerformanceTheme => {
  return isTheme(value) ? value : Theme.SYSTEM;
};

const applyTheme = (theme: PerformanceTheme) => {
  document.documentElement.classList.remove(...themes);
  document.documentElement.classList.add(theme);
};

export const themeAtom = atomWithStorage<PerformanceTheme>(
  "theme",
  Theme.SYSTEM,
  {
    getItem: (key) => parseTheme(localStorage.getItem(key)),
    setItem: (key, value) => {
      applyTheme(value);
      localStorage.setItem(key, value);
    },
    removeItem: (key) => localStorage.removeItem(key),
    subscribe: (key, callback) => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key !== key) return;

        const theme = parseTheme(event.newValue);
        applyTheme(theme);
        callback(theme);
      };

      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    },
  },
);

const systemThemeAtom = atom<ResolvedTheme>(Theme.LIGHT);

systemThemeAtom.onMount = (setTheme) => {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const update = () => setTheme(media.matches ? Theme.DARK : Theme.LIGHT);

  update();
  media.addEventListener("change", update);
  return () => media.removeEventListener("change", update);
};

export const resolvedThemeAtom = atom<ResolvedTheme>((get) => {
  const theme = get(themeAtom);
  return theme === Theme.SYSTEM ? get(systemThemeAtom) : theme;
});
