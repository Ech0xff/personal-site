import * as stylex from "@stylexjs/stylex";

import { darkShadowTheme, darkTheme, lightTheme } from "./admin-theme.stylex";

export const darkThemeClasses = (
  stylex.props(darkTheme, darkShadowTheme).className ?? ""
)
  .split(" ")
  .filter(Boolean);

export const lightThemeClasses = (stylex.props(lightTheme).className ?? "")
  .split(" ")
  .filter(Boolean);
