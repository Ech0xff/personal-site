import MarkdownRenderer from "./MarkdownRenderer";

interface Props {
  content: string;
  className?: string;
}

/**
 * Markdown component for Post content
 * Used in post detail pages and dashboard preview
 */
export default function PostMarkdown({ content, className = "" }: Props) {
  return <MarkdownRenderer content={content} className={className} />;
}
