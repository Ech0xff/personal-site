import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

interface ThoughtMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Markdown component for Thought content
 * Used in thought timeline and dashboard preview
 */
export default function ThoughtMarkdown({
  content,
  className = "",
}: ThoughtMarkdownProps) {
  return (
    <div
      className={`prose prose-zinc dark:prose-invert max-w-none text-base leading-relaxed text-zinc-800 dark:text-zinc-200 ${className}`}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
