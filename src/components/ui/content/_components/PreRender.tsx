import { ComponentPropsWithoutRef } from "react";
import type { Options } from "react-markdown";

import type { Element, Root } from "hast";
import rehypePrism from "rehype-prism-plus";
import { visit } from "unist-util-visit";

import CopyButton from "@/components/ui/CopyButton";
import { cn } from "@/lib/shared/utils";

import styles from "./PreRender.module.css";

interface Props extends ComponentPropsWithoutRef<"pre"> {
  code?: string;
  language?: string;
}

function CodeBlockHeader({
  language,
  rawCode,
  className,
}: {
  language: string;
  rawCode?: string;
  className: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 font-medium tracking-wide uppercase",
        className,
      )}
    >
      <span className="truncate">{language}</span>
      <CopyButton content={rawCode} className="text-xs" />
    </div>
  );
}

export function PreRender({
  children,
  code,
  language = "TEXT",
  ...props
}: Props) {
  return (
    <div className="not-prose overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-[0.9em] dark:border-zinc-800 dark:bg-zinc-900">
      <CodeBlockHeader
        language={language}
        rawCode={code}
        className="border-b border-zinc-200 bg-zinc-100/90 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-800/90"
      />
      <pre {...props} className={cn("p-3", styles.codeBlock)}>
        {children}
      </pre>
    </div>
  );
}

export const rehypePlugins: Options["rehypePlugins"] = [
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
          code: rawCode,
          language,
        };
      });
    };
  },
  [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
];
