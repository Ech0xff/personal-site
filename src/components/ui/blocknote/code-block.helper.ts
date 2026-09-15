import * as stylex from "@stylexjs/stylex";

import { isPlantUml, plantUmlUrl } from "#lib/shared/content/plantuml.helper";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { codeStyles as styles } from "./code-block.style";
import { createCodeIcon } from "./code-icon.helper";

export function createCodeSurface(
  pre: HTMLElement,
  language: string,
  source: string,
  showSource = !source,
) {
  const root = document.createElement("div");
  root.setAttribute("data-code-surface", "");
  root.className = stylex.props(styles.root).className ?? "";
  const toolbar = document.createElement("div");
  toolbar.contentEditable = "false";
  toolbar.className = stylex.props(styles.toolbar).className ?? "";
  const label = document.createElement("span");
  label.textContent = language || "text";
  label.className = stylex.props(styles.language).className ?? "";
  toolbar.append(label);
  const button = (
    action: string,
    icon: "copy" | "code" | "diagram",
    title: string,
    text?: string,
  ) => {
    const node = document.createElement("button");
    node.type = "button";
    node.dataset.codeAction = action;
    node.append(createCodeIcon(icon));
    if (text) node.append(document.createTextNode(text));
    node.title = title;
    node.setAttribute("aria-label", title);
    node.className = stylex.props(styles.button).className ?? "";
    toolbar.append(node);
    return node;
  };
  button("copy", "copy", copy.copyLabel, copy.copy);
  const sourceView = document.createElement("div");
  sourceView.setAttribute("data-code-source", "");
  sourceView.append(pre);
  root.append(toolbar, sourceView);
  if (isPlantUml(language)) {
    const toggle = button(
      "toggle",
      showSource ? "diagram" : "code",
      showSource ? copy.showDiagram : copy.showCode,
    );
    toggle.setAttribute("aria-pressed", String(showSource));
    const diagram = document.createElement("button");
    diagram.type = "button";
    diagram.contentEditable = "false";
    diagram.setAttribute("data-code-diagram", "");
    diagram.setAttribute("data-viewer-trigger", "");
    diagram.setAttribute("data-src", plantUmlUrl(source));
    diagram.setAttribute("data-alt", copy.diagram);
    diagram.setAttribute("aria-label", copy.preview);
    diagram.className = stylex.props(styles.diagram).className ?? "";
    const image = document.createElement("img");
    image.src = plantUmlUrl(source);
    image.alt = copy.diagram;
    image.loading = "lazy";
    image.className = stylex.props(styles.image).className ?? "";
    diagram.append(image);
    const notice = document.createElement("p");
    notice.setAttribute("data-code-error", "");
    notice.textContent = copy.failed;
    notice.className = stylex.props(styles.notice).className ?? "";
    notice.hidden = true;
    root.append(diagram, notice);
    sourceView.hidden = !showSource;
    diagram.hidden = showSource;
  }
  return { root, label, sourceView };
}

export async function activateCodeControl(target: EventTarget | null) {
  if (!(target instanceof Element)) return;
  const button = target.closest<HTMLButtonElement>("button[data-code-action]");
  const root = button?.closest<HTMLElement>("[data-code-surface]");
  if (!button || !root) return;
  const source = root.querySelector<HTMLElement>("[data-code-source]");
  if (!source) return;
  const code = source.querySelector("code")?.textContent ?? "";
  if (button.dataset.codeAction === "copy") {
    try {
      await navigator.clipboard.writeText(code);
      button.replaceChildren(
        createCodeIcon("check"),
        document.createTextNode(copy.copied),
      );
    } catch {
      button.replaceChildren(
        createCodeIcon("copy"),
        document.createTextNode(copy.copyFailed),
      );
    }
    setTimeout(() => {
      button.replaceChildren(
        createCodeIcon("copy"),
        document.createTextNode(copy.copy),
      );
    }, 1600);
    return;
  }
  const diagram = root.querySelector<HTMLButtonElement>("[data-code-diagram]");
  const image = diagram?.querySelector("img");
  if (!diagram || !image) return;
  source.hidden = !source.hidden;
  diagram.hidden = !source.hidden;
  button.replaceChildren(createCodeIcon(source.hidden ? "code" : "diagram"));
  button.title = source.hidden ? copy.showCode : copy.showDiagram;
  button.setAttribute("aria-label", button.title);
  button.setAttribute("aria-pressed", String(!source.hidden));
  if (source.hidden) {
    const url = plantUmlUrl(code);
    image.src = url;
    diagram.dataset.src = url;
    const notice = root.querySelector<HTMLElement>("[data-code-error]");
    if (notice) notice.hidden = true;
  }
}

export function showDiagramError(target: EventTarget | null) {
  if (!(target instanceof HTMLImageElement)) return;
  const notice = target
    .closest("[data-code-surface]")
    ?.querySelector<HTMLElement>("[data-code-error]");
  if (notice) notice.hidden = false;
}

const copy = defaultDictionary.editor.code;
