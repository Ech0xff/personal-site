// src/components/ui/markdown/MarkdownRenderer.tsx
import type { Options } from "react-markdown";
import Markdown from "react-markdown";

import type { Element, Root } from "hast";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import { visit } from "unist-util-visit";

import { cn } from "@/lib/shared/utils";

import CodeBlockWrapper from "./CodeBlockWrapper";

interface Props {
  content: string;
  className?: string;
}

const rehypePlugins: Options["rehypePlugins"] = [
  () => {
    return (tree: Root) => {
      visit(tree, "element", (node) => {
        if (node.tagName !== "pre") return;
        const codeNode = node.children.find(
          (child): child is Element =>
            child.type === "element" && child.tagName === "code",
        );
        if (!codeNode) return;
        const firstChild = codeNode.children[0];
        const rawCode =
          firstChild?.type === "text" ? firstChild.value : undefined;
        if (!rawCode) return;
        const className = codeNode.properties.className;
        const firstClassName =
          typeof className === "string"
            ? className
            : Array.isArray(className) && typeof className[0] === "string"
              ? className[0]
              : "";
        const match = firstClassName.match(/language-([a-z0-9+#-]+)/i);
        const language = match ? match[1].toUpperCase() : "TEXT";
        node.properties = {
          ...node.properties,
          "data-raw-code": rawCode,
          "data-language": language,
        };
      });
    };
  },
  [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
];

export default function MarkdownRenderer({ content, className = "" }: Props) {
  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-none [&>div]:shadow-none",
        className,
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehypePlugins}
        components={{
          pre: CodeBlockWrapper,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
