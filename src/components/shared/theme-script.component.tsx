import {
  Theme,
  THEME_STORAGE_KEY,
  THEME_MEDIA_QUERY,
  THEME_ATTRIBUTE,
  THEME_PREFERENCE_ATTRIBUTE,
} from "#lib/shared/theme/theme.const";

// The pre-paint script uses the same constants as the runtime, without serializing functions.
const source = `(() => {
  const Theme = ${JSON.stringify(Theme)};
  const stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});

  const preference = Object.values(Theme).includes(stored) ? stored : Theme.SYSTEM;
  const systemDark = matchMedia(${JSON.stringify(THEME_MEDIA_QUERY)}).matches;
  const resolved = preference === Theme.SYSTEM
    ? (systemDark ? Theme.DARK : Theme.LIGHT)
    : preference;

  const root = document.documentElement;
  root.setAttribute(${JSON.stringify(THEME_ATTRIBUTE)}, resolved);
  root.setAttribute(${JSON.stringify(THEME_PREFERENCE_ATTRIBUTE)}, preference);
  root.style.colorScheme = resolved;
})();`;

const ThemeScript = () => (
  <script dangerouslySetInnerHTML={{ __html: source }} />
);
export default ThemeScript;
