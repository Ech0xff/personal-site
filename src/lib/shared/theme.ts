export const Theme = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export type PerformanceTheme = (typeof Theme)[keyof typeof Theme];
export type ResolvedTheme = Exclude<PerformanceTheme, typeof Theme.SYSTEM>;

export const themes = Object.values(Theme);

export const isTheme = (val: unknown): val is PerformanceTheme =>
  themes.some((t) => t === val);

export const getNextTheme = (theme: PerformanceTheme): PerformanceTheme => {
  const currentIndex = themes.indexOf(theme);
  return themes[(currentIndex + 1) % themes.length];
};
