import { deskItemDefinitions, type DeskItem } from "./desk-item.schema";
import type {
  DeskBreakpoint,
  DeskLayout,
  DeskPlacement,
  PersonalLayouts,
} from "./desk-layout.schema";

export type Size = Readonly<{ width: number; height: number }>;
export type Box = Size & Readonly<{ x: number; y: number }>;
export type PlacedItem = Readonly<{
  item: DeskItem;
  box: Box;
  scale: number;
  width: number;
  height: number;
  padding: number;
}>;
export const deskBreakpoint = (width: number): DeskBreakpoint =>
  width <= 600 ? "phone" : width < 1024 ? "tablet" : "desktop";
const gap = 16;
export const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.width + gap &&
  a.x + a.width + gap > b.x &&
  a.y < b.y + b.height + gap &&
  a.y + a.height + gap > b.y;

/** Search obstacle edges, including their intersections, with stable distance ordering. */
export function findPosition(
  target: Box,
  obstacles: readonly Box[],
  width: number,
  height = Infinity,
): Box | null {
  const clampX = (x: number) =>
    Math.max(0, Math.min(x, Math.max(0, width - target.width)));
  if (target.width > width || target.height > height) return null;
  const clampY = (y: number) =>
    Math.max(0, Math.min(y, height - target.height));
  const desired = { ...target, x: clampX(target.x), y: clampY(target.y) };
  if (!obstacles.some((box) => overlaps(desired, box))) return desired;
  const xs = [
    desired.x,
    0,
    clampX(width),
    ...obstacles.flatMap((box) => [
      clampX(box.x - target.width - gap),
      clampX(box.x + box.width + gap),
    ]),
  ];
  const ys = [
    desired.y,
    0,
    ...(Number.isFinite(height) ? [height - target.height] : []),
    ...obstacles.flatMap((box) => [
      clampY(box.y - target.height - gap),
      clampY(box.y + box.height + gap),
    ]),
  ];
  const distance = (box: Box) =>
    (box.x - desired.x) ** 2 + (box.y - desired.y) ** 2;
  return (
    xs
      .flatMap((x) => ys.map((y) => ({ ...target, x, y })))
      .filter((candidate) => !obstacles.some((box) => overlaps(candidate, box)))
      .sort((a, b) => distance(a) - distance(b) || a.y - b.y || a.x - b.x)[0] ??
    null
  );
}

export function nearestPosition(
  target: Box,
  obstacles: readonly Box[],
  width: number,
): Box {
  return findPosition(target, obstacles, width) ?? target;
}

export function layoutDesk(
  items: readonly DeskItem[],
  layout: DeskLayout,
  viewport: Size,
  measured: Readonly<Partial<Record<string, Size>>>,
  personal?: PersonalLayouts[DeskBreakpoint],
): readonly PlacedItem[] {
  const breakpoint = deskBreakpoint(viewport.width);
  const placed: PlacedItem[] = [];
  const ordered = [...items].sort(
    (a, b) =>
      Number(deskItemDefinitions[a.type].capabilities.draggable) -
      Number(deskItemDefinitions[b.type].capabilities.draggable),
  );
  for (const item of ordered) {
    const definition = deskItemDefinitions[item.type];
    const size = measured[item.id] ?? definition;
    const padding = definition.padding;
    const saved = layout.placements[item.id] ?? {
      x: 0,
      y: layout.height,
      scale: 1,
    };
    let scale = Math.min(
      Math.max(saved.scale, definition.minScale),
      definition.maxScale,
      (viewport.width - padding * 2) / definition.width,
    );
    let width: number = definition.width;
    let height = size.height;
    let x = (saved.x * viewport.width) / layout.width;
    let y = (saved.y * viewport.height) / layout.height;
    if (item.type === "intro") {
      scale = 1;
      width =
        breakpoint === "desktop"
          ? Math.min(560, Math.max(300, viewport.width - 748))
          : Math.min(560, viewport.width - 48);
      height = measured[item.id]?.height ?? 320;
      x = (viewport.width - width) / 2;
      y =
        breakpoint === "desktop"
          ? Math.max(165, viewport.height * 0.48 - height / 2)
          : 165;
    }
    if (item.type === "lamp") {
      height = definition.height;
      scale = 1;
      x = (viewport.width - width) / 2;
      y = 0;
    }
    const desired = {
      x,
      y,
      width: width * scale + padding * 2,
      height: height * scale + padding * 2,
    };
    const box = definition.capabilities.draggable
      ? nearestPosition(
          desired,
          placed.map((entry) => entry.box),
          viewport.width,
        )
      : desired;
    placed.push({ item, box, scale, width, height, padding });
  }
  if (!personal) return placed;
  const movableOverrides = placed.filter(
    (entry) =>
      deskItemDefinitions[entry.item.type].capabilities.draggable &&
      personal.positions[entry.item.id],
  );
  const result = placed.filter((entry) => !movableOverrides.includes(entry));
  for (const entry of movableOverrides) {
    const position = personal.positions[entry.item.id];
    const box = nearestPosition(
      {
        ...entry.box,
        x: (position.x * viewport.width) / personal.width,
        y: (position.y * viewport.height) / personal.height,
      },
      result.map((other) => other.box),
      viewport.width,
    );
    result.push({ ...entry, box });
  }
  return placed.map(
    (entry) => result.find((other) => other.item.id === entry.item.id) ?? entry,
  );
}

export function savePlacement(
  box: Box,
  scale: number,
  viewport: Size,
  layout: DeskLayout,
): DeskPlacement {
  return {
    x: (box.x * layout.width) / viewport.width,
    y: (box.y * layout.height) / viewport.height,
    scale,
  };
}

/** Seeded placement keeps random composition separate from collision resolution. */
export function shuffleDesk(
  entries: readonly PlacedItem[],
  viewport: Size,
  seed: number,
): readonly PlacedItem[] {
  let state = seed >>> 0;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const fixed = entries.filter(
    (entry) => !deskItemDefinitions[entry.item.type].capabilities.draggable,
  );
  if (
    fixed.some(
      ({ box }) =>
        box.x < 0 ||
        box.y < 0 ||
        box.x + box.width > viewport.width ||
        box.y + box.height > viewport.height,
    )
  )
    return entries;
  const movable = entries.filter(
    (entry) => deskItemDefinitions[entry.item.type].capabilities.draggable,
  );
  for (let attempt = 0; attempt < 32; attempt++) {
    const ordered = movable
      .map((entry) => ({ entry, order: random() }))
      .sort((a, b) => a.order - b.order);
    const placed = [...fixed];
    for (const { entry } of ordered) {
      const box = findPosition(
        {
          ...entry.box,
          x: random() * Math.max(0, viewport.width - entry.box.width),
          y: random() * Math.max(0, viewport.height - entry.box.height),
        },
        placed.map((item) => item.box),
        viewport.width,
        viewport.height,
      );
      if (!box) break;
      placed.push({ ...entry, box });
    }
    if (placed.length === entries.length)
      return entries.map(
        (entry) =>
          placed.find((item) => item.item.id === entry.item.id) ?? entry,
      );
  }
  return entries;
}
