import MarkdownRenderer from "./MarkdownRenderer";

interface Props {
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
}: Props) {
  return <MarkdownRenderer content={content} className={className} />;
}
