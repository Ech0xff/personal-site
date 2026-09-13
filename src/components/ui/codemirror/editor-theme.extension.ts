import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";

import { color, font } from "#design/tokens.stylex";

const highlighting = HighlightStyle.define([
  { tag: tags.comment, color: color.codeComment },
  { tag: tags.keyword, color: color.codeKeyword },
  { tag: [tags.string, tags.special(tags.string)], color: color.codeString },
  {
    tag: [tags.function(tags.variableName), tags.propertyName],
    color: color.codeFunction,
  },
  { tag: [tags.className, tags.typeName], color: color.codeClass },
  { tag: [tags.number, tags.bool], color: color.codeNumber },
  { tag: [tags.operator, tags.punctuation], color: color.codeOperator },
  { tag: tags.regexp, color: color.codeRegex },
  { tag: tags.heading, fontWeight: font.bold },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strong, fontWeight: font.bold },
  { tag: tags.link, color: color.accentText, textDecoration: "underline" },
]);

export const createEditorTheme = (dark: boolean) => [
  EditorView.theme(
    {
      "&": {
        backgroundColor: color.input,
        color: color.codeText,
        height: "100%",
      },
      ".cm-scroller": { backgroundColor: color.input, fontFamily: font.mono },
      ".cm-gutters": {
        backgroundColor: color.surfaceMuted,
        color: color.muted,
        borderColor: color.line,
      },
      ".cm-content": { caretColor: color.text },
      ".cm-cursor, .cm-dropCursor": { borderLeftColor: color.text },
      ".cm-activeLine, .cm-activeLineGutter": {
        backgroundColor: color.surfaceHover,
      },
      "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection":
        { backgroundColor: color.accentStrong },
      ".cm-selectionMatch": { backgroundColor: color.accentSurface },
      ".cm-panels, .cm-tooltip": {
        backgroundColor: color.surface,
        color: color.text,
        borderColor: color.line,
      },
      ".cm-searchMatch": {
        backgroundColor: color.warningSurface,
        outline: `1px solid ${color.warningBorder}`,
      },
      ".cm-searchMatch.cm-searchMatch-selected": {
        backgroundColor: color.accentStrong,
      },
    },
    { dark },
  ),
  syntaxHighlighting(highlighting),
];
