"use client";

import { atom } from "jotai";

import {
  Theme,
  THEME_STORAGE_KEY,
  THEME_MEDIA_QUERY,
  THEME_ATTRIBUTE,
  THEME_PREFERENCE_ATTRIBUTE,
} from "#lib/shared/theme/theme.const";
import { parseTheme, resolveTheme } from "#lib/shared/theme/theme.helper";
import type {
  ThemePreference,
  ResolvedTheme,
} from "#lib/shared/theme/theme.type";

type ThemeState = Readonly<{
  preference: ThemePreference;
  systemDark: boolean;
}>;
type ThemeUpdate =
  | Readonly<{ type: "initialize"; state: ThemeState }>
  | Readonly<{
      type: "preference";
      preference: ThemePreference;
      persist: boolean;
    }>
  | Readonly<{ type: "system"; systemDark: boolean }>;

const _theme = atom<ThemeState>({
  preference: Theme.SYSTEM,
  systemDark: false,
});

const stateAtom = atom(
  (get) => get(_theme),
  (get, set, update: ThemeUpdate) => {
    const current = get(_theme);
    const next =
      update.type === "initialize"
        ? update.state
        : update.type === "system"
          ? { ...current, systemDark: update.systemDark }
          : { ...current, preference: update.preference };

    set(_theme, next);
    if (typeof window === "undefined") return;

    const resolved = resolveTheme(next.preference, next.systemDark);
    const root = document.documentElement;
    root.setAttribute(THEME_ATTRIBUTE, resolved);
    root.setAttribute(THEME_PREFERENCE_ATTRIBUTE, next.preference);
    root.style.colorScheme = resolved;

    if (update.type === "preference" && update.persist) {
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next.preference);
      } catch {
        // Theme changes still work when browser storage is unavailable.
      }
    }
  },
);

stateAtom.onMount = (update) => {
  const media = matchMedia(THEME_MEDIA_QUERY);
  let preference: ThemePreference = Theme.SYSTEM;
  try {
    preference = parseTheme(localStorage.getItem(THEME_STORAGE_KEY));
  } catch {
    // Use the system preference when storage cannot be read.
  }
  update({
    type: "initialize",
    state: { preference, systemDark: media.matches },
  });

  const onSystemChange = (event: MediaQueryListEvent) =>
    update({ type: "system", systemDark: event.matches });
  const onStorage = (event: StorageEvent) => {
    if (event.storageArea !== localStorage) return;
    if (event.key !== THEME_STORAGE_KEY && event.key !== null) return;
    update({
      type: "preference",
      preference: parseTheme(event.newValue),
      persist: false,
    });
  };
  media.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  return () => {
    media.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
};

export const themeAtom = atom(
  (get) => get(stateAtom).preference,
  (
    get,
    set,
    update: ThemePreference | ((previous: ThemePreference) => ThemePreference),
  ) =>
    set(stateAtom, {
      type: "preference",
      preference:
        typeof update === "function"
          ? update(get(stateAtom).preference)
          : update,
      persist: true,
    }),
);

export const resolvedThemeAtom = atom<ResolvedTheme>((get) => {
  const { preference, systemDark } = get(stateAtom);
  return resolveTheme(preference, systemDark);
});
