import type { CmsBlock } from "./blocknote.schema";

function inlineText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(inlineText).join("");
  if (!value || typeof value !== "object") return "";
  if ("text" in value && typeof value.text === "string") return value.text;
  if ("content" in value) return inlineText(value.content);
  if ("rows" in value && Array.isArray(value.rows))
    return value.rows.map(inlineText).join(" ");
  if ("cells" in value && Array.isArray(value.cells))
    return value.cells.map(inlineText).join(" ");
  return "";
}
export const documentText = (blocks: readonly CmsBlock[]): string =>
  blocks
    .map((block) => {
      if (block.type === "linkCard")
        return (
          [block.props?.title, block.props?.description, block.props?.siteName]
            .filter(Boolean)
            .join(" ") ||
          block.props?.url ||
          ""
        );
      const name = block.props && "name" in block.props ? block.props.name : "";
      return [
        inlineText(block.content),
        name,
        documentText(block.children ?? []),
      ]
        .filter(Boolean)
        .join(" ");
    })
    .join("\n");
export const hasDocumentContent = (blocks: readonly CmsBlock[]): boolean =>
  blocks.some((block) => {
    const media =
      block.type === "image" ||
      block.type === "audio" ||
      block.type === "video" ||
      block.type === "file" ||
      block.type === "linkCard";
    return (
      Boolean(inlineText(block.content).trim()) ||
      (media && Boolean(block.props?.url)) ||
      hasDocumentContent(block.children ?? [])
    );
  });

export const documentTitle = (blocks: readonly CmsBlock[]): string => {
  const heading = blocks.find((block) => block.type === "heading");
  return heading ? inlineText(heading.content).trim() : "";
};

// Convert the retired row format to the official column structure on edit.
export const migrateMediaRows = (blocks: readonly CmsBlock[]): CmsBlock[] =>
  blocks.flatMap((block) => {
    const children = migrateMediaRows(block.children ?? []);
    if (block.type !== "mediaRow") return [{ ...block, children }];
    const columns = block.props?.columns ?? 2;
    return Array.from(
      { length: Math.ceil(children.length / columns) },
      (_, index): CmsBlock => ({
        ...(index === 0 && block.id ? { id: block.id } : {}),
        type: "columnList",
        children: Array.from({ length: columns }, (_, offset): CmsBlock => ({
          type: "column",
          props: { width: 1 },
          children: [
            children[index * columns + offset] ?? { type: "paragraph" },
          ],
        })),
      }),
    );
  });
