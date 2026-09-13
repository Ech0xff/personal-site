import { documentText } from "./document.helper";
import type { BlockDocument } from "./document.schema";

export type ArticleHeading = Readonly<{
  id: string;
  text: string;
  level: number;
}>;

/** The first top-level heading is the CMS title; retain any children beneath it. */
export function prepareArticle(document: BlockDocument) {
  const titleIndex = document.findIndex((block) => block.type === "heading");
  const ids = new Set<string>();
  const headings: ArticleHeading[] = [];
  const walk = (blocks: BlockDocument, path: string): BlockDocument =>
    blocks.flatMap((block, index) => {
      const location = `${path}-${index}`;
      if (path === "block" && index === titleIndex) {
        return walk(block.children ?? [], location);
      }
      if (block.type === "heading") {
        const base = `section-${encodeURIComponent(block.id ?? location)}`;
        let id = base;
        let suffix = 1;
        while (ids.has(id)) id = `${base}-${++suffix}`;
        ids.add(id);
        const level = block.props?.level === 1 ? 2 : (block.props?.level ?? 2);
        headings.push({
          id,
          level,
          text: documentText([{ ...block, children: [] }]).trim(),
        });
        return [
          {
            ...block,
            props: { ...block.props, level },
            children: walk(block.children ?? [], location),
          },
        ];
      }
      return [{ ...block, children: walk(block.children ?? [], location) }];
    });
  const blocks = walk(document, "block");
  return { blocks, headings };
}
