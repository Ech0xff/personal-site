import type { EditorView } from "@codemirror/view";
import type { SyntaxNode, SyntaxNodeRef } from "@lezer/common";

// Lezer emits small marker nodes for Markdown punctuation, such as "**" or
// "[", and their parent node tells us which Markdown construct they belong to.
const markerParents: Record<string, readonly string[]> = {
  CodeMark: ["InlineCode", "FencedCode"], // `inline code`, ```fenced code```
  EmphasisMark: ["Emphasis", "StrongEmphasis"], // *italic*, **bold**
  LinkMark: ["Link"], // [label](url)
  StrikethroughMark: ["Strikethrough"], // ~~strikethrough~~
  URL: ["Link"], // [label](url)
};

/**
 * Returns true when the node is the Markdown heading marker, such as "#".
 */
export const isHeadingMarker = (node: SyntaxNodeRef, parentName = "") => {
  return (
    node.name === "HeaderMark" &&
    (parentName.startsWith("ATXHeading") ||
      parentName.startsWith("SetextHeading"))
  );
};

/**
 * Returns true when the node is Markdown syntax that decorates content rather
 * than content itself, such as "**", "`", "[", "]", or a link URL.
 */
export const isFormattingMarker = (node: SyntaxNodeRef, parentName = "") => {
  return (
    isHeadingMarker(node, parentName) ||
    markerParents[node.name]?.includes(parentName)
  );
};

/**
 * Returns true when any cursor or selection range is inside or overlaps the
 * given syntax node.
 */
export const selectionTouches = (view: EditorView, node: SyntaxNode) => {
  return view.state.selection.ranges.some((range) => {
    if (range.empty) {
      return range.from >= node.from && range.from <= node.to;
    }

    return range.from < node.to && range.to > node.from;
  });
};

/**
 * Returns the document range that should be visually hidden for a formatting
 * marker. Heading markers also hide the following space for cleaner live mode.
 */
export const markerRangeToHide = (view: EditorView, node: SyntaxNodeRef) => {
  if (node.name !== "HeaderMark") {
    return { from: node.from, to: node.to };
  }

  // Heading markers include only "#" in the syntax tree. Hide the following
  // space too so live mode shows "Title" instead of " Title".
  const nextCharacter = view.state.doc.sliceString(node.to, node.to + 1);
  const to =
    nextCharacter === " " || nextCharacter === "\t" ? node.to + 1 : node.to;

  return { from: node.from, to };
};
