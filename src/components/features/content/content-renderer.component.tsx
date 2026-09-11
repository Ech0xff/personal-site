import {
  Children,
  type ComponentPropsWithoutRef,
  isValidElement,
  type ReactNode,
} from "react";
import type { Components, Options } from "react-markdown";
import Markdown from "react-markdown";
import rehypePrism from "rehype-prism-plus";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";

import { useDictionary } from "#dictionary";
import { cn, rehypeHeadingIds } from "#lib/shared/utils";

import {
  DirectiveRender,
  remarkContentNodes,
} from "./_components/directive-render";
import { DIRECTIVE_RENDER_ELEMENT_NAME } from "./_components/directive-render/directive.const";
import {
  PreRender,
  rehypeCodeBlockProps,
} from "./_components/pre-render.component";

interface Props {
  content: string;
  className?: string;
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
      <div className="not-prose flex flex-wrap items-center gap-2" {...props}>
        {Children.toArray(children).filter((node) => !isWhitespaceNode(node))}
      </div>
    );
  }

  return <p {...props}>{children}</p>;
}

function TableRender(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="overflow-x-auto overscroll-x-contain">
      <table {...props} />
    </div>
  );
}

const rehypePlugins: Options["rehypePlugins"] = [
  rehypeHeadingIds,
  rehypeCodeBlockProps,
  [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
];

function MarkdownImageRender({
  src,
  alt,
  ...props
}: ComponentPropsWithoutRef<"img">) {
  const dictionary = useDictionary();
  if (typeof src !== "string") return null;
  return (
    <span className="inline-block max-w-full align-middle">
      <button
        type="button"
        data-viewer-trigger
        data-src={src}
        data-alt={alt}
        aria-label={alt || dictionary.common.viewImage}
        className="block max-w-full cursor-zoom-in rounded-lg"
      >
        {/* oxlint-disable-next-line next/no-img-element -- Markdown accepts arbitrary remote image URLs and preserves natural dimensions. */}
        <img
          {...props}
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          className="h-auto max-w-full rounded-lg"
        />
      </button>
    </span>
  );
}

const components = {
  p: ParagraphRender,
  img: MarkdownImageRender,
  pre: PreRender,
  table: TableRender,
  [DIRECTIVE_RENDER_ELEMENT_NAME]: DirectiveRender,
} satisfies Components & {
  [DIRECTIVE_RENDER_ELEMENT_NAME]: typeof DirectiveRender;
};

export default function ContentRenderer({ content, className = "" }: Props) {
  return (
    <div
      className={cn(
        "content-prose prose max-w-none [&>div]:shadow-none",
        className,
      )}
    >
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
