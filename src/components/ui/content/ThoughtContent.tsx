import ContentRenderer from "./ContentRenderer";

interface Props {
  content: string;
  className?: string;
}

/**
 * Markdown component for Thought content
 * Used in thought timeline and dashboard preview
 */
export default function ThoughtContent({ content, className = "" }: Props) {
  return <ContentRenderer content={content} className={className} />;
}
