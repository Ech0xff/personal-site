import { createBlockSpecFromTiptapNode } from "@blocknote/core";
import { ColumnListBlock } from "@blocknote/xl-multi-column";

import { columnLayoutProps, columnLayoutSchema } from "./column-layout.schema";

const upstreamNode = ColumnListBlock.implementation.node;

// Keep upstream child containers, drag/drop, and serialization; extend only layout attributes.
const node = upstreamNode.extend({
  addAttributes() {
    return Object.fromEntries(
      (
        ["gap", "mediaLayout", "mediaHeight", "mediaFit", "equalCards"] as const
      ).map((name) => {
        const spec = columnLayoutProps[name];
        return [
          name,
          {
            default: spec.default,
            parseHTML: (element: HTMLElement) => {
              const raw = element.getAttribute(`data-${name.toLowerCase()}`);
              if (raw === null) return spec.default;
              const value =
                typeof spec.default === "number"
                  ? Number(raw)
                  : typeof spec.default === "boolean"
                    ? raw === "true"
                    : raw;
              const parsed = columnLayoutSchema.safeParse({ [name]: value });
              return parsed.success ? parsed.data[name] : spec.default;
            },
            renderHTML: (attributes: Record<string, unknown>) => {
              const parsed = columnLayoutSchema.parse(attributes);
              return { [`data-${name.toLowerCase()}`]: String(parsed[name]) };
            },
          },
        ];
      }),
    );
  },
  renderHTML({ HTMLAttributes, node }) {
    const dom = renderColumnList(node, HTMLAttributes);
    return { dom, contentDOM: dom };
  },
  addNodeView() {
    return ({ node, HTMLAttributes }) => {
      const dom = renderColumnList(node, HTMLAttributes);
      return {
        dom,
        contentDOM: dom,
        update(next) {
          if (next.type !== node.type) return false;
          const updated = renderColumnList(next, HTMLAttributes);
          for (const attribute of Array.from(updated.attributes))
            dom.setAttribute(attribute.name, attribute.value);
          return true;
        },
        ignoreMutation(mutation) {
          return mutation.type === "attributes" && mutation.target === dom;
        },
      };
    };
  },
});

export const columnLayoutBlock = createBlockSpecFromTiptapNode(
  { node, type: "columnList", content: "none" },
  columnLayoutProps,
);

function renderColumnList(
  current: Readonly<{
    attrs: Record<string, unknown>;
    forEach: (
      callback: (column: {
        attrs: Record<string, unknown>;
        childCount: number;
      }) => void,
    ) => void;
  }>,
  attributes: Record<string, unknown>,
) {
  const props = columnLayoutSchema.parse(current.attrs);
  const dom = document.createElement("div");
  for (const [key, value] of Object.entries(attributes))
    dom.setAttribute(key, String(value));
  dom.classList.add("bn-block-column-list");
  dom.setAttribute("data-node-type", "columnList");
  for (const [key, value] of Object.entries(props))
    dom.setAttribute(`data-${key.toLowerCase()}`, String(value));
  dom.style.setProperty("--cms-column-gap", `${props.gap}px`);
  dom.style.setProperty("--cms-media-height", `${props.mediaHeight}px`);
  const widths: number[] = [];
  let rows = 1;
  current.forEach((column) => {
    widths.push(Number(column.attrs.width) || 1);
    rows = Math.max(rows, column.childCount + 1);
  });
  dom.style.setProperty(
    "--cms-column-tracks",
    widths.map((width) => `minmax(0, ${width}fr)`).join(" "),
  );
  dom.style.setProperty("--cms-column-rows", String(rows));
  return dom;
}
