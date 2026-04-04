"use client";

import {
  ComponentPropsWithoutRef,
  ReactElement,
  isValidElement,
  useRef,
  useState,
} from "react";
import Markdown from "react-markdown";
import type { Options } from "react-markdown";

import { Check, Copy } from "lucide-react";
import rehypePrism from "rehype-prism-plus";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { cn } from "@/lib/shared/utils";
import styles from "./MarkdownRenderer.module.css";

interface Props {
  content: string;
  className?: string;
}

const rehypePlugins: Options["rehypePlugins"] = [
  [rehypePrism, { ignoreMissing: true, showLineNumbers: true }],
];

function getCodeLanguage(children: React.ReactNode) {
  const codeChild = Array.isArray(children) ? children[0] : children;
  if (!isValidElement(codeChild)) return "TEXT";

  const className = String(
    (codeChild as ReactElement<{ className?: string }>).props.className || "",
  );
  const match = className.match(/language-([a-z0-9+#-]+)/i);

  return match?.[1]?.toUpperCase() || "TEXT";
}

function CodeBlockPre({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"pre">) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const language = getCodeLanguage(children);

  const handleCopy = async () => {
    const codeElement = containerRef.current?.querySelector("code");
    const code = codeElement?.innerText;

    if (!code) {
      toast.error("No code found to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code.");
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "not-prose my-6 overflow-hidden rounded-2xl border shadow-[0_22px_60px_rgba(2,6,23,0.14)]",
        "border-zinc-200/80 bg-[#f8fafc] dark:border-black/40 dark:bg-[#0f1724] dark:shadow-[0_22px_60px_rgba(2,6,23,0.32)]",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between border-b px-3 py-2.5 backdrop-blur-xl",
          "border-zinc-200/80 bg-zinc-100/92 dark:border-white/10 dark:bg-zinc-950/70",
        )}
      >
        <span className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase dark:text-zinc-400">
          {language}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-xs font-medium transition-colors",
            "border-zinc-300/80 bg-white/85 text-zinc-700 backdrop-blur",
            "hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-300/35",
            "dark:border-white/10 dark:bg-white/8 dark:text-zinc-100 dark:hover:bg-white/12",
          )}
          title="Copy code"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre {...props} className={cn(styles.codeBlock, className)}>
        {children}
      </pre>
    </div>
  );
}

export default function MarkdownRenderer({ content, className = "" }: Props) {
  return (
    <div
      className={cn(
        "prose dark:prose-invert max-w-none",
        styles.root,
        className,
      )}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={rehypePlugins}
        components={{
          pre: CodeBlockPre,
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
