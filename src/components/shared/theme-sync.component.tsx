"use client";
import { useAtomValue } from "jotai";

import { resolvedThemeAtom } from "#lib/client/theme/theme.atom";

/** Each UI root mounts one subscriber in its own state store. */
export default function ThemeSync() {
  useAtomValue(resolvedThemeAtom);
  return null;
}
