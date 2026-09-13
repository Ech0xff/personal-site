import * as stylex from "@stylexjs/stylex";
import {
  Children,
  createElement,
  type HTMLAttributes,
  type ComponentPropsWithoutRef,
  isValidElement,
  type ReactNode,
} from "react";
import type { Components, Options, ExtraProps } from "react-markdown";
import Markdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";

import type { StyleInput } from "#design/style.type";
import { color, font, space, shape } from "#design/tokens.stylex";
import { useDictionary } from "#dictionary";
import { rehypeHeadingIds } from "#lib/shared/utils";

import {
  DirectiveRender,
  remarkContentNodes,
} from "./_components/directive-render";
import { DIRECTIVE_RENDER_ELEMENT_NAME } from "./_components/directive-render/directive.const";
import {
  PreRender,
  rehypeCodeBlockProps,
} from "./_components/pre-render.component";
const styles = stylex.create({
  container: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: space.xs,
  },
  container2: {
    overflowX: "auto",
    overscrollBehaviorX: "contain",
  },
  label: {
    display: "inline-block",
    maxWidth: "100%",
    verticalAlign: "middle",
  },
  button: {
    display: "block",
    maxWidth: "100%",
    cursor: "zoom-in",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
  },
  image: {
    height: "auto",
    maxWidth: "100%",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
  },
  container3: {
    maxWidth: "none",
    color: color.secondary,
    fontFamily: font.body,
    fontSize: font.bodySize,
    lineHeight: 1.75,
    overflowWrap: "break-word",
  },
});
interface Props {
  content: string;
  xstyle?: StyleInput;
}
function isWhitespaceNode(node: ReactNode) {
  return typeof node === "string" && node.trim().length === 0;
}
function isImageParagraph(children: ReactNode) {
  const nodes = Children.toArray(children);
  const contentNodes = nodes.filter((node) => !isWhitespaceNode(node));
  return (
    contentNodes.length > 0 &&
    contentNodes.every(
      (node) =>
        isValidElement(node) &&
        typeof node.type === "string" &&
        node.type === "img",
    )
  );
}
function ParagraphRender({
  children,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  if (isImageParagraph(children)) {
    return (
      <div {...stylex.props(styles.container)} {...props}>
        {Children.toArray(children).filter((node) => !isWhitespaceNode(node))}
      </div>
    );
  }
  return (
    <p {...props} {...stylex.props(prose.paragraph)}>
      {children}
    </p>
  );
}
function TableRender(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div {...stylex.props(styles.container2)}>
      <table {...props} {...stylex.props(prose.table)} />
    </div>
  );
}
const rehypePlugins: Options["rehypePlugins"] = [
  rehypeHeadingIds,
  rehypeCodeBlockProps,
  [
    rehypePrism,
    {
      ignoreMissing: true,
      showLineNumbers: true,
    },
  ],
];
function MarkdownImageRender({
  src,
  alt,
  ...props
}: ComponentPropsWithoutRef<"img">) {
  const dictionary = useDictionary();
  if (typeof src !== "string") return null;
  return (
    <span {...stylex.props(styles.label)}>
      <button
        type="button"
        data-viewer-trigger
        data-src={src}
        data-alt={alt}
        aria-label={alt || dictionary.common.viewImage}
        {...stylex.props(styles.button)}
      >
        {/* oxlint-disable-next-line next/no-img-element -- Markdown accepts arbitrary remote image URLs and preserves natural dimensions. */}
        <img
          {...props}
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          {...stylex.props(styles.image)}
        />
      </button>
    </span>
  );
}
type ProseTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "a"
  | "ul"
  | "ol"
  | "li"
  | "blockquote"
  | "hr"
  | "strong"
  | "code"
  | "th"
  | "td"
  | "thead";
function proseElement(tag: ProseTag, xstyle: StyleInput) {
  return ({
    node: _node,
    ...props
  }: HTMLAttributes<HTMLElement> & ExtraProps) =>
    createElement(tag, {
      ...props,
      ...stylex.props(xstyle),
    });
}
const prose = stylex.create({
  paragraph: {
    marginBlock: space.md,
  },
  heading: {
    color: color.text,
    fontWeight: font.bold,
    marginTop: space.xl,
    marginBottom: space.md,
    lineHeight: 1.3,
  },
  h1: {
    fontSize: font.heading,
  },
  h2: {
    fontSize: font.subtitle,
  },
  h3: {
    fontSize: font.large,
  },
  link: {
    color: color.accentText,
    textDecorationLine: "underline",
    textUnderlineOffset: "3px",
  },
  list: {
    paddingLeft: space.lg,
    marginBlock: space.md,
  },
  unordered: {
    listStyleType: "disc",
  },
  ordered: {
    listStyleType: "decimal",
  },
  item: {
    paddingLeft: space.xxs,
    marginBlock: space.xs,
  },
  quote: {
    borderLeftWidth: "4px",
    borderLeftStyle: "solid",
    borderLeftColor: color.borderStrong,
    paddingLeft: space.lg,
    marginBlock: space.lg,
    fontStyle: "italic",
    color: color.text,
  },
  rule: {
    borderTopWidth: shape.fine,
    borderTopStyle: "solid",
    borderTopColor: color.line,
    marginBlock: space.xl,
  },
  strong: {
    color: color.text,
    fontWeight: font.semibold,
  },
  table: {
    width: "100%",
    textAlign: "left",
    fontSize: font.control,
    marginBlock: space.lg,
  },
  cell: {
    padding: space.xs,
    borderBottomWidth: shape.fine,
    borderBottomStyle: "solid",
    borderBottomColor: color.line,
    verticalAlign: "top",
  },
  header: {
    color: color.text,
    fontWeight: font.semibold,
  },
  code: {
    fontFamily: font.mono,
    fontSize: ".9em",
  },
});
const components = {
  h1: proseElement("h1", [prose.heading, prose.h1]),
  h2: proseElement("h2", [prose.heading, prose.h2]),
  h3: proseElement("h3", [prose.heading, prose.h3]),
  h4: proseElement("h4", prose.heading),
  h5: proseElement("h5", prose.heading),
  h6: proseElement("h6", prose.heading),
  a: proseElement("a", prose.link),
  ul: proseElement("ul", [prose.list, prose.unordered]),
  ol: proseElement("ol", [prose.list, prose.ordered]),
  li: proseElement("li", prose.item),
  blockquote: proseElement("blockquote", prose.quote),
  hr: proseElement("hr", prose.rule),
  strong: proseElement("strong", prose.strong),
  th: proseElement("th", [prose.cell, prose.header]),
  td: proseElement("td", prose.cell),
  thead: proseElement("thead", prose.header),
  code: ({ node: _node, className, ...props }) => (
    <code
      {...props}
      className={[className, stylex.props(prose.code).className]
        .filter(Boolean)
        .join(" ")}
    />
  ),
  p: ParagraphRender,
  img: MarkdownImageRender,
  pre: PreRender,
  table: TableRender,
  [DIRECTIVE_RENDER_ELEMENT_NAME]: DirectiveRender,
} satisfies Components & {
  [DIRECTIVE_RENDER_ELEMENT_NAME]: typeof DirectiveRender;
};
export default function ContentRenderer({ content, xstyle }: Props) {
  return (
    <div {...stylex.props([styles.container3, xstyle])}>
      <Markdown
        remarkPlugins={[remarkDirective, remarkGfm, remarkContentNodes]}
        rehypePlugins={rehypePlugins}
        components={components}
      >
        {content}
      </Markdown>
    </div>
  );
}
