import * as stylex from "@stylexjs/stylex";

import { color, font, shape } from "#design/tokens.stylex";
export const blocknoteStyles = stylex.create({
  readonly: {
    minHeight: 0,
    "--cms-heading-one": font.subtitle,
    "--cms-heading-two": font.large,
  },
  root: {
    minHeight: "200px",
    width: "100%",
    fontFamily: font.body,
    "--bn-colors-editor-text": color.text,
    "--bn-colors-editor-background": color.surface,
    "--bn-colors-menu-text": color.text,
    "--bn-colors-menu-background": color.surface,
    "--bn-colors-tooltip-text": color.inverse,
    "--bn-colors-tooltip-background": color.text,
    "--bn-colors-hovered-text": color.text,
    "--bn-colors-hovered-background": color.surfaceHover,
    "--bn-colors-selected-text": color.onAccent,
    "--bn-colors-selected-background": color.accent,
    "--bn-colors-disabled-text": color.muted,
    "--bn-colors-disabled-background": color.surfaceMuted,
    "--bn-colors-shadow": color.line,
    "--bn-colors-border": color.line,
    "--bn-colors-side-menu": color.muted,
    "--bn-border-radius": shape.control,
    "--bn-font-family": font.body,
    "--cms-code-font": font.mono,
  },
});
