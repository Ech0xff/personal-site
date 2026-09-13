import type { PartialBlock } from "@blocknote/core";

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
export const documentText = (blocks: readonly PartialBlock[]): string =>
  blocks
    .map((block) => {
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
export const hasDocumentContent = (blocks: readonly PartialBlock[]): boolean =>
  blocks.some((block) => {
    const media =
      block.type === "image" ||
      block.type === "audio" ||
      block.type === "video" ||
      block.type === "file";
    return (
      Boolean(inlineText(block.content).trim()) ||
      (media && Boolean(block.props?.url)) ||
      hasDocumentContent(block.children ?? [])
    );
  });

export const documentTitle = (blocks: readonly PartialBlock[]): string => {
  const heading = blocks.find((block) => block.type === "heading");
  return heading ? inlineText(heading.content).trim() : "";
};
