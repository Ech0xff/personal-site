// src/components/ui/markdown/ContentRenderer.tsx

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
            pre: PreRender,
            [DIRECTIVE_RENDER_ELEMENT_NAME]: DirectiveRender,
          } as Record<string, React.ElementType>
        }
      >
        {content}
      </Markdown>
    </div>
  );
}
