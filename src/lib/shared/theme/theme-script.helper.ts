import {
  Theme,
  THEME_STORAGE_KEY,
  THEME_MEDIA_QUERY,
  THEME_ATTRIBUTE,
  THEME_PREFERENCE_ATTRIBUTE,
} from "./theme.const";

// The pre-paint script uses the same constants as the runtime, without serializing functions.
export const createThemeScript = (
  darkThemeClasses: readonly string[],
  lightThemeClasses: readonly string[] = [],
): string => `(() => {
  const Theme = ${JSON.stringify(Theme)};
  let stored;
  try { stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}); } catch {}

  const preference = Object.values(Theme).includes(stored) ? stored : Theme.SYSTEM;
  const systemDark = matchMedia(${JSON.stringify(THEME_MEDIA_QUERY)}).matches;
  const resolved = preference === Theme.SYSTEM
    ? (systemDark ? Theme.DARK : Theme.LIGHT)
    : preference;

  const root = document.documentElement;
  root.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)}, resolved);
  root.setAttribute(${JSON.stringify(THEME_PREFERENCE_ATTRIBUTE)}, preference);
  root.style.colorScheme = resolved;
  for (const name of ${JSON.stringify(darkThemeClasses)}) root.classList.toggle(name, resolved === Theme.DARK);
  for (const name of ${JSON.stringify(lightThemeClasses)}) root.classList.toggle(name, resolved === Theme.LIGHT);
})();`;
