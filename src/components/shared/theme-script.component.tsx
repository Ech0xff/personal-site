import { darkThemeClasses, lightThemeClasses } from "#design/theme.helper";
import { createThemeScript } from "#lib/shared/theme/theme-script.helper";

const source = createThemeScript(darkThemeClasses, lightThemeClasses);
export default function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: source }} />;
}
