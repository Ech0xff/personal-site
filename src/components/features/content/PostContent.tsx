import ContentRenderer from "./ContentRenderer";

interface Props {
  content: string;
  className?: string;
}

/**
 * Markdown component for Post content
 * Used in post detail pages and dashboard preview
 */
export default function PostContent({ content, className = "" }: Props) {
  return <ContentRenderer content={content} className={className} />;
}
