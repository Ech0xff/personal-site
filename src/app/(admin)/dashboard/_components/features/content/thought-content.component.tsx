import type { StyleInput } from "#design/style.type";

import ContentRenderer from "./content-renderer.component";
interface Props {
  content: string;
  xstyle?: StyleInput;
}

/**
 * Markdown component for Thought content
 * Used in thought timeline and dashboard preview
 */
export default function ThoughtContent({ content, xstyle }: Props) {
  return <ContentRenderer content={content} xstyle={xstyle} />;
}
