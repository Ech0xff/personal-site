import type { Theme } from "./theme.const";

export type ThemePreference = (typeof Theme)[keyof typeof Theme];
export type ResolvedTheme = Exclude<ThemePreference, typeof Theme.SYSTEM>;
