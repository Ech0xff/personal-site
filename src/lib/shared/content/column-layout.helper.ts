import type { CmsBlock } from "./blocknote.schema";

export function resizeColumnCount(
  columns: readonly CmsBlock[],
  count: number,
): CmsBlock[] {
  if (!Number.isInteger(count) || count < 2 || count > 100) return [...columns];
  const kept = columns.slice(0, count);
  if (count < columns.length) {
    return kept.map((column, index) =>
      index === count - 1
        ? {
            ...column,
            children: [
              ...(column.children ?? []),
              ...columns.slice(count).flatMap((extra) => extra.children ?? []),
            ],
          }
        : column,
    );
  }
  return [
    ...kept,
    ...Array.from({ length: count - columns.length }, (): CmsBlock => ({
      type: "column",
      props: { width: 1 },
      children: [{ type: "paragraph" }],
    })),
  ];
}

export function columnPercentages(columns: readonly CmsBlock[]): number[] {
  const weights = columns.map((column) =>
    column.type === "column" ? (column.props?.width ?? 1) : 1,
  );
  const sum = weights.reduce((total, weight) => total + weight, 0);
  return weights.map((weight) => (weight / sum) * 100);
}

export function setColumnPercentage(
  columns: readonly CmsBlock[],
  index: number,
  percentage: number,
): CmsBlock[] {
  if (
    !Number.isFinite(percentage) ||
    percentage < 1 ||
    percentage > 99 ||
    !columns[index]
  )
    return [...columns];
  const widths = columnPercentages(columns);
  const remaining = widths.reduce(
    (total, width, position) => (position === index ? total : total + width),
    0,
  );
  return columns.map((column, position) =>
    column.type === "column"
      ? {
          ...column,
          props: {
            ...column.props,
            width:
              ((position === index
                ? percentage
                : (widths[position] / remaining) * (100 - percentage)) *
                columns.length) /
              100,
          },
        }
      : column,
  );
}
