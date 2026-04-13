import type { Element, Root, RootContent } from "hast";
import { visit } from "unist-util-visit";

export interface MarkdownHeading {
  id: string;
  depth: number;
  text: string;
}

const HEADING_REGEX = /^(#{1,6})\s+(.+?)\s*#*\s*$/;
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\([^)]+\)/g;
const MARKDOWN_IMAGE_REGEX = /!\[([^\]]*)\]\([^)]+\)/g;
const MARKDOWN_DECORATION_REGEX = /[`*_~]/g;
const NON_SLUG_CHARACTER_REGEX = /[^\p{L}\p{N}\s-]/gu;
const HEADING_SCROLL_MARGIN_CLASS = "scroll-mt-24";

export const createHeadingIdGenerator = () => {
  const seenIds = new Map<string, number>();

  return (text: string) => {
    const baseId =
      text
        .trim()
        .toLowerCase()
        .replace(NON_SLUG_CHARACTER_REGEX, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "heading";

    const count = seenIds.get(baseId) ?? 0;
    seenIds.set(baseId, count + 1);

    return count === 0 ? baseId : `${baseId}-${count + 1}`;
  };
};

const normalizeHeadingText = (text: string) =>
  text
    .replace(MARKDOWN_IMAGE_REGEX, "$1")
    .replace(MARKDOWN_LINK_REGEX, "$1")
    .replace(MARKDOWN_DECORATION_REGEX, "")
    .trim();

export const getMarkdownHeadings = (content: string): MarkdownHeading[] => {
  const getHeadingId = createHeadingIdGenerator();

  return content.split(/\r?\n/).flatMap((line) => {
    const match = line.match(HEADING_REGEX);
    if (!match) return [];

    const text = normalizeHeadingText(match[2]);
    if (!text) return [];

    return [
      {
        id: getHeadingId(text),
        depth: match[1].length,
        text,
      },
    ];
  });
};

const getNodeText = (node: RootContent): string => {
  if (node.type === "text") return node.value;
  if ("children" in node) return node.children.map(getNodeText).join("");
  return "";
};

const withHeadingScrollMargin = (className: unknown) => {
  if (Array.isArray(className))
    return [...className, HEADING_SCROLL_MARGIN_CLASS];
  if (typeof className === "string")
    return [className, HEADING_SCROLL_MARGIN_CLASS];
  return [HEADING_SCROLL_MARGIN_CLASS];
};

/** rehype plugin to add IDs to headings */
export const rehypeHeadingIds = () => {
  return (tree: Root) => {
    const getHeadingId = createHeadingIdGenerator();

    visit(tree, "element", (node: Element) => {
      if (!/^h[1-6]$/.test(node.tagName)) return;

      const text = node.children.map(getNodeText).join("").trim();
      if (!text) return;

      node.properties = {
        ...node.properties,
        id: getHeadingId(text),
        className: withHeadingScrollMargin(node.properties.className),
      };
    });
  };
};
