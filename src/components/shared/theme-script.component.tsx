import { Theme } from "#lib/shared/theme/theme.const";

const source = `
  const theme = localStorage.getItem("theme") ?? ${JSON.stringify(Theme.SYSTEM)};
  document.documentElement.classList.add(theme);
`;

const ThemeScript = () => (
  <script dangerouslySetInnerHTML={{ __html: source }} />
);
export default ThemeScript;
