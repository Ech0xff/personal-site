// src/components/ui/markdown/ContentRenderer.tsx
import Markdown from "react-markdown";

import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/shared/utils";

import { PreRender, rehypePlugins } from "./_components/PreRender";
import {
  DirectiveRender,
  remarkContentNodes,
} from "./_components/directive-render";
import { DIRECTIVE_RENDER_ELEMENT_NAME } from "./_components/directive-render/const";

interface Props {
  content: string;
  className?: string;
}

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
