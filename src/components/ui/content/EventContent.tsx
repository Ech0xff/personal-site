import ContentRenderer from "./ContentRenderer";

interface Props {
  content: string;
  className?: string;
}

/**
 * Markdown component for Event description
 * Used in event timeline and dashboard preview
 */
export default function EventContent({ content, className = "" }: Props) {
  return <ContentRenderer content={content} className={className} />;
}
