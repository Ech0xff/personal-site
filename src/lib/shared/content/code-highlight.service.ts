import {
  bundledLanguages,
  bundledLanguagesInfo,
  createHighlighter,
  createCssVariablesTheme,
} from "shiki";

export const codeLanguages = [
  { id: "text", name: "Plain text", aliases: ["txt", "plaintext"] },
  { id: "plantuml", name: "PlantUML", aliases: ["puml"] },
  ...bundledLanguagesInfo.map(({ id, name, aliases }) => ({
    id,
    name,
    aliases: aliases ?? [],
  })),
];

let highlighter: ReturnType<typeof createHighlighter> | undefined;
export function codeHighlightLanguage(language: string) {
  const normalized = language.toLowerCase();
  return Object.hasOwn(bundledLanguages, normalized) ? normalized : "text";
}
export function getCodeHighlighter() {
  highlighter ??= createHighlighter({
    themes: [createCssVariablesTheme({ name: "site" })],
    langs: [],
  });
  return highlighter;
}

export async function highlightCode(source: string, language: string) {
  const instance = await getCodeHighlighter();
  const grammar = Object.entries(bundledLanguages).find(
    ([id]) => id === codeHighlightLanguage(language),
  );
  if (grammar) await instance.loadLanguage(grammar[1]);
  return instance.codeToHtml(source, {
    lang: grammar ? grammar[0] : "text",
    theme: "site",
  });
}
