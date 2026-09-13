import * as stylex from "@stylexjs/stylex";

import { darkShadowTheme, darkTheme } from "./admin-theme.stylex";

export const darkThemeClasses = (
  stylex.props(darkTheme, darkShadowTheme).className ?? ""
)
  .split(" ")
  .filter(Boolean);
