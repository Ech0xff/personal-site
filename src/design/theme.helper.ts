import * as stylex from "@stylexjs/stylex";

import {
  darkTheme,
  darkShadowTheme,
  darkMaterialTheme,
  darkLightingTheme,
  lightTheme,
  lightShadowTheme,
  lightMaterialTheme,
  lightLightingTheme,
} from "./tokens.stylex";

export const darkThemeClasses = (
  stylex.props(darkTheme, darkShadowTheme, darkMaterialTheme, darkLightingTheme)
    .className ?? ""
)
  .split(" ")
  .filter(Boolean);
export const lightThemeClasses = (
  stylex.props(
    lightTheme,
    lightShadowTheme,
    lightMaterialTheme,
    lightLightingTheme,
  ).className ?? ""
)
  .split(" ")
  .filter(Boolean);
