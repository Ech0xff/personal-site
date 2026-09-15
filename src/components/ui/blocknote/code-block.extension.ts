import { createBlockSpec, defaultBlockSpecs } from "@blocknote/core";

import { codeHighlightLanguage } from "#lib/shared/content/code-highlight.service";

import {
  activateCodeControl,
  createCodeSurface,
  showDiagramError,
} from "./code-block.helper";
import { createCodeLanguageInput } from "./code-language.helper";

const codeText = (
  content: string | readonly Readonly<{ text: string }>[] | undefined,
) =>
  typeof content === "string"
    ? content
    : (content?.map((part) => part.text).join("") ?? "");
const base = defaultBlockSpecs.codeBlock;
// Node views can be recreated by editor transactions; view state is not document data.
const sourceViews = new WeakMap<object, Set<string>>();
export const codeBlock = createBlockSpec(
  base.config,
  {
    ...base.implementation,
    meta: {
      ...base.implementation.meta,
      highlight: (block) => codeHighlightLanguage(block.props.language),
    },
    render: (block, editor) => {
      const pre = document.createElement("pre");
      const code = document.createElement("code");
      pre.append(code);
      const source = codeText(block.content);
      let visibleSources = sourceViews.get(editor);
      if (!visibleSources) {
        visibleSources = new Set();
        sourceViews.set(editor, visibleSources);
      }
      if (!source) visibleSources.add(block.id);
      const surface = createCodeSurface(
        pre,
        block.props.language,
        source,
        visibleSources.has(block.id),
      );
      const languageInput = editor.isEditable
        ? createCodeLanguageInput(block.props.language, (language) =>
            editor.updateBlock(block.id, { props: { language } }),
          )
        : null;
      if (languageInput) surface.label.replaceWith(languageInput.input);
      const click = (event: MouseEvent) => {
        if (
          event.target instanceof Element &&
          event.target.closest('[data-code-action="toggle"]')
        ) {
          if (surface.sourceView.hidden) visibleSources.add(block.id);
          else visibleSources.delete(block.id);
        }
        void activateCodeControl(event.target);
      };
      surface.root.addEventListener("click", click);
      const error = (event: Event) => showDiagramError(event.target);
      surface.root.addEventListener("error", error, true);
      return {
        dom: surface.root,
        contentDOM: code,
        // Toolbar state is UI only; reparsing it would replace the focused input.
        ignoreMutation: (mutation) =>
          mutation.type !== "selection" && !code.contains(mutation.target),
        destroy: () => {
          languageInput?.destroy();
          surface.root.removeEventListener("click", click);
          surface.root.removeEventListener("error", error, true);
        },
      };
    },
  },
  base.extensions,
)();
