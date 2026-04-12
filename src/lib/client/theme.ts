"use client";

import Cookies from "js-cookie";

export type Theme = "light" | "dark" | "system";

const themes: readonly Theme[] = ["light", "dark", "system"] as const;

export const toggleTheme = (theme?: Theme) => {
  if (!theme) {
    theme = getThemeFromDocument();
    const index = themes.indexOf(theme);
    theme = themes[(index + 1) % themes.length];
  }
  const html = document.documentElement;
  html.classList.remove(...themes);
  html.classList.add(theme);
  Cookies.set("theme", theme, { expires: 365 });
};

export const getThemeFromDocument = (): Theme => {
  const html = document.documentElement;
  if (html.classList.contains("light")) return "light";
  if (html.classList.contains("dark")) return "dark";
  return "system";
};

export const getThemeFromCookie = (): Theme => {
  const theme = Cookies.get("theme") as Theme;
  if (themes.includes(theme)) return theme;
  return "system";
};
