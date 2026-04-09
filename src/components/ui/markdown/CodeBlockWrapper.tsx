"use client";

import { ComponentPropsWithoutRef, useState } from "react";

import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/shared/utils";

import styles from "./CodeBlockWrapper.module.css";

interface Props extends ComponentPropsWithoutRef<"pre"> {
  "data-raw-code"?: string;
  "data-language"?: string;
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
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!rawCode) {
      toast.error("No code found to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy code.");
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 font-medium tracking-wide uppercase",
        className,
      )}
    >
      <span className="truncate">{language}</span>
      <button
        type="button"
        onClick={handleCopy}
        title="Copy code"
        aria-label="Copy code"
        className="inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors hover:bg-zinc-200/80 focus:outline-none dark:hover:bg-zinc-700/80"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" /> Copied
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Copy
          </>
        )}
      </button>
    </div>
  );
}

export default function CodeBlockWrapper({
  children,
  "data-raw-code": rawCode,
  "data-language": language = "TEXT",
  ...props
}: Props) {
  return (
    <div className="not-prose overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 text-[0.9em] dark:border-zinc-800 dark:bg-zinc-900">
      <CodeBlockHeader
        language={language}
        rawCode={rawCode}
        className="border-b border-zinc-200 bg-zinc-100/90 px-3 py-1 dark:border-zinc-800 dark:bg-zinc-800/90"
      />
      <pre {...props} className={cn("p-3", styles.codeBlock)}>
        {children}
      </pre>
    </div>
  );
}
