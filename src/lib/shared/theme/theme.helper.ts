import { Theme, themes } from "./theme.const";
import type { ResolvedTheme, ThemePreference } from "./theme.type";

export const parseTheme = (value: unknown): ThemePreference =>
  themes.find((theme) => theme === value) ?? Theme.SYSTEM;

export const resolveTheme = (
  preference: ThemePreference,
  systemDark: boolean,
): ResolvedTheme => {
  if (preference !== Theme.SYSTEM) return preference;
  return systemDark ? Theme.DARK : Theme.LIGHT;
};

export const getNextTheme = (theme: ThemePreference): ThemePreference => {
  const currentIndex = themes.indexOf(theme);
  return themes[(currentIndex + 1) % themes.length];
};
