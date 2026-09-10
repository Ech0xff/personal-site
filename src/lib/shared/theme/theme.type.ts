import type { Theme } from "./theme.const";

export type PerformanceTheme = (typeof Theme)[keyof typeof Theme];
export type ResolvedTheme = Exclude<PerformanceTheme, typeof Theme.SYSTEM>;
