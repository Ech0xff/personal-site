import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

interface EventMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Markdown component for Event description
 * Used in event timeline and dashboard preview
 */
export default function EventMarkdown({
  content,
  className = "",
}: EventMarkdownProps) {
  return (
    <div
      className={`prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-300 ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
