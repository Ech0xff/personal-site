// src/components/ui/markdown/ContentRenderer.tsx

import {
  Children,
  type ComponentPropsWithoutRef,
  isValidElement,
  type ReactNode,
} from "react";
import type { Options } from "react-markdown";
import Markdown from "react-markdown";

import rehypePrism from "rehype-prism-plus";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";

import { cn, rehypeHeadingIds } from "@/lib/shared/utils";
import {
  DirectiveRender,
  remarkContentNodes,
} from "./_components/directive-render";
import { DIRECTIVE_RENDER_ELEMENT_NAME } from "./_components/directive-render/const";
import { PreRender, rehypeCodeBlockProps } from "./_components/PreRender";

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
    <div className="scrollbar-visible overflow-x-auto overscroll-x-contain">
      <table {...props} />
    </div>
  );
}

const rehypePlugins: Options["rehypePlugins"] = [
  rehypeHeadingIds,
  rehypeCodeBlockProps,
  [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
];

export default function ContentRenderer({ content, className = "" }: Props) {
  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-none [&>div]:shadow-none",
        className,
      )}
    >
      <Markdown
        remarkPlugins={[remarkDirective, remarkGfm, remarkContentNodes]}
        rehypePlugins={rehypePlugins}
        components={
          {
            p: ParagraphRender,
            pre: PreRender,
            table: TableRender,
            [DIRECTIVE_RENDER_ELEMENT_NAME]: DirectiveRender,
          } as Record<string, React.ElementType>
        }
      >
        {content}
      </Markdown>
    </div>
  );
}
