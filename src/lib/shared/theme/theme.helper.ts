import { themes } from "./theme.const";
import type { PerformanceTheme } from "./theme.type";

export const isTheme = (val: unknown): val is PerformanceTheme =>
  themes.some((t) => t === val);

export const getNextTheme = (theme: PerformanceTheme): PerformanceTheme => {
  const currentIndex = themes.indexOf(theme);
  return themes[(currentIndex + 1) % themes.length];
};
