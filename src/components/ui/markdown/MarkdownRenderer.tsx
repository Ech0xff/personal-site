"use client";

import { MarkdownHooks } from "react-markdown";

import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import type { Code } from "mdast";
import type { ExpressiveCodeTheme } from "rehype-expressive-code";
import rehypeExpressiveCode from "rehype-expressive-code";
import remarkGfm from "remark-gfm";
import type { PluggableList } from "unified";
import { visit } from "unist-util-visit";

import { cn } from "@/lib/shared/utils";

const HAS_TITLE_META_REGEXP = /\btitle=(?:"[^"]*"|'[^']*'|[^\s]+)/;

const remarkPlugins: PluggableList = [
  remarkGfm,
  () => {
    return (tree) => {
      visit(tree, "code", (node) => {
        const codeNode = node as Code;
        if (!codeNode.lang) return;
        const meta = (codeNode.meta || "").trim();
        if (HAS_TITLE_META_REGEXP.test(meta)) return;
        const title = codeNode.lang.toUpperCase();
        codeNode.meta = meta ? `${meta} title="${title}"` : `title="${title}"`;
      });
    };
  },
];
const rehypePlugins: PluggableList = [
  [
    rehypeExpressiveCode,
    {
      plugins: [pluginLineNumbers()],
      themeCssSelector: (theme: ExpressiveCodeTheme) =>
        theme.type === "dark" ? ".dark" : ".light",
    },
  ],
];

interface Props {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: Props) {
  return (
    <div className={cn("prose dark:prose-invert max-w-none", className)}>
      <MarkdownHooks
        fallback={null}
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
      >
        {content}
      </MarkdownHooks>
    </div>
  );
}
