import { type ResolvedTheme, type Theme, themes } from "./constants";

export namespace ThemeHelper {
  export const format = (value: unknown, fallback: Theme = "system"): Theme => {
    if (typeof value !== "string") return fallback;
    if (themes.includes(value as Theme)) return value as Theme;
    return fallback;
  };

  export const resolve = (
    theme: Theme,
    prefersDark: boolean,
  ): ResolvedTheme => {
    if (theme !== "system") return theme;
    return prefersDark ? "dark" : "light";
  };

  export const getFromHtml = (fallback: Theme = "system"): Theme => {
    if (typeof document === "undefined") return fallback;

    const html = document.documentElement;
    const theme = themes.find((item) => html.classList.contains(item));

    return format(theme, fallback);
  };

  export const toggle = (theme?: Theme) => {
    let nextTheme = theme;

    if (!nextTheme) {
      const currentTheme = getFromHtml();
      const index = themes.indexOf(currentTheme);
      nextTheme = themes[(index + 1) % themes.length];
    }

    const html = document.documentElement;
    html.classList.remove(...themes);
    html.classList.add(nextTheme);
    // biome-ignore lint/suspicious/noDocumentCookie: This keeps the SSR theme cookie aligned with the html class.
    document.cookie = `theme=${nextTheme}; max-age=31536000; path=/; SameSite=Lax`;
  };
}
