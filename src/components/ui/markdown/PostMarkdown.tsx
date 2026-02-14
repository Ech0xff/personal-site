import ReactMarkdown from "react-markdown";

import "highlight.js/styles/github-dark.css";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

interface PostMarkdownProps {
  content: string;
  className?: string;
}

/**
 * Markdown component for Post content
 * Used in post detail pages and dashboard preview
 */
export default function PostMarkdown({
  content,
  className = "",
}: PostMarkdownProps) {
  return (
    <div
      className={`prose prose-lg dark:prose-invert prose-headings:font-bold prose-h1:text-3xl prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline max-w-none ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
