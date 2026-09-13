import type { StyleInput } from "#design/style.type";

import ContentRenderer from "./content-renderer.component";
interface Props {
  content: string;
  xstyle?: StyleInput;
}

/**
 * Markdown component for Event description
 * Used in event timeline and dashboard preview
 */
export default function EventContent({ content, xstyle }: Props) {
  return <ContentRenderer content={content} xstyle={xstyle} />;
}
