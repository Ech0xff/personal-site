import MarkdownRenderer from "./MarkdownRenderer";

interface Props {
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
}: Props) {
  return (
    <MarkdownRenderer
      content={content}
    />
  );
}
