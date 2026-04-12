"use client";

import { Check, Copy } from "lucide-react";
import { type ButtonHTMLAttributes, useState } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/shared/utils";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  content?: string;
  idleLabel?: string;
  copiedLabel?: string;
  emptyMessage?: string;
  successMessage?: string;
  errorMessage?: string;
}

export default function CopyButton({
  content,
  idleLabel = "Copy",
  copiedLabel = "Copied",
  emptyMessage = "Nothing to copy.",
  successMessage,
  errorMessage = "Failed to copy.",
  className,
  ...props
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!content) {
      toast.error(emptyMessage);
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      if (successMessage) toast.success(successMessage);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(errorMessage);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={idleLabel}
      aria-label={idleLabel}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 font-medium transition-colors hover:bg-zinc-200/80 focus:outline-none dark:hover:bg-zinc-700/80",
        className,
      )}
      {...props}
    >
      {copied ? (
        <>
          <Check className="size-[1em]" /> {copiedLabel}
        </>
      ) : (
        <>
          <Copy className="size-[1em]" /> {idleLabel}
        </>
      )}
    </button>
  );
}
