import { darkThemeClasses } from "#design/admin-theme.helper";
import { createThemeScript } from "#lib/shared/theme/theme-script.helper";

const source = createThemeScript(darkThemeClasses);
export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: source }} />;
}
