"use client";
import { useAtomValue, useSetAtom } from "jotai";
import { useSyncExternalStore } from "react";

import { Theme } from "#lib/shared/theme/theme.const";

import { resolvedThemeAtom, themeAtom } from "./theme.atom";
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/** Each hydration boundary starts with the server snapshot, even if the store is already mounted. */
export function useThemePreference() {
  const hydrated = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const preference = useAtomValue(themeAtom);
  const setPreference = useSetAtom(themeAtom);
  return [hydrated ? preference : Theme.SYSTEM, setPreference] as const;
}
export function useResolvedTheme() {
  const hydrated = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );
  const theme = useAtomValue(resolvedThemeAtom);
  return hydrated ? theme : Theme.LIGHT;
}
