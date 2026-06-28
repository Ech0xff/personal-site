import { markdown } from "@codemirror/lang-markdown";
import { syntaxTree } from "@codemirror/language";
import type { Extension, Range } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  type EditorView,
  ViewPlugin,
  type ViewUpdate,
} from "@codemirror/view";
import { GFM } from "@lezer/markdown";
import * as NodeHelper from "./markdown-node.helper";

const languageExtension = markdown({
  extensions: [GFM],
});

const buildLiveDecorations = (view: EditorView) => {
  const ranges: Range<Decoration>[] = [];

  for (const visibleRange of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from: visibleRange.from,
      to: visibleRange.to,
      enter(node) {
        const parent = node.node.parent;
        const parentName = parent?.name;

        // Keep Markdown syntax visible while the cursor/selection is inside
        // that syntax group; hide it only when the user is editing elsewhere.
        if (
          parent &&
          NodeHelper.isFormattingMarker(node, parentName) &&
          !NodeHelper.selectionTouches(view, parent)
        ) {
          const range = NodeHelper.markerRangeToHide(view, node);

          ranges.push(Decoration.replace({}).range(range.from, range.to));
        }
      },
    });
  }

  return Decoration.set(ranges, true);
};

const liveExtension = [
  ViewPlugin.fromClass(
    class {
      decorations: DecorationSet;
      constructor(view: EditorView) {
        this.decorations = buildLiveDecorations(view);
      }
      update(update: ViewUpdate) {
        // Decorations depend on parsed text, cursor position, and visible
        // viewport. Any of those changes can reveal or hide Markdown markers.
        if (
          update.docChanged ||
          update.selectionSet ||
          update.viewportChanged
        ) {
          this.decorations = buildLiveDecorations(update.view);
        }
      }
    },
    {
      decorations: (plugin) => plugin.decorations,
    },
  ),
];

export const resolveExtensions = (mode: "source" | "live"): Extension => {
  return [languageExtension, ...(mode === "live" ? liveExtension : [])];
};
