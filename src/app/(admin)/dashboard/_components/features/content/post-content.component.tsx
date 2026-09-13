import type { StyleInput } from "#design/style.type";

import ContentRenderer from "./content-renderer.component";
interface Props {
  content: string;
  xstyle?: StyleInput;
}

/**
 * Markdown component for Post content
 * Used in post detail pages and dashboard preview
 */
export default function PostContent({ content, xstyle }: Props) {
  return <ContentRenderer content={content} xstyle={xstyle} />;
}
