"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import type { ResolvedTheme, Theme } from "./constants";
import { ThemeHelper } from "./helper";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  toggleTheme: (theme?: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface Props {
  children: ReactNode;
  initialTheme: Theme;
}

const colorSchemeQuery = "(prefers-color-scheme: dark)";

export function ThemeProvider({ children, initialTheme }: Props) {
  const subscribeTheme = useCallback((onStoreChange: () => void) => {
    const html = document.documentElement;
    const media = window.matchMedia(colorSchemeQuery);
    const observer = new MutationObserver(onStoreChange);

    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    media.addEventListener("change", onStoreChange);

    return () => {
      observer.disconnect();
      media.removeEventListener("change", onStoreChange);
    };
  }, []);

  const snapshot = useSyncExternalStore(
    subscribeTheme,
    () => {
      const theme = ThemeHelper.getFromHtml(initialTheme);
      const prefersDark = window.matchMedia(colorSchemeQuery).matches;
      return `${theme}:${ThemeHelper.resolve(theme, prefersDark)}`;
    },
    () => `${initialTheme}:${ThemeHelper.resolve(initialTheme, false)}`,
  );

  const value = useMemo<ThemeContextValue>(() => {
    const [theme, resolvedTheme] = snapshot.split(":") as [
      Theme,
      ResolvedTheme,
    ];

    return {
      theme,
      resolvedTheme,
      toggleTheme: ThemeHelper.toggle,
    };
  }, [snapshot]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
