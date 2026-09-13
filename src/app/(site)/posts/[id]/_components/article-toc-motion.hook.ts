import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";

type RowPosition = Readonly<{ node: HTMLElement; rect: DOMRect }>;
type Layout = Readonly<{
  navigation: DOMRect;
  surface: DOMRect;
  opacity: string;
  rows: readonly RowPosition[];
}>;

function readLayout(root: HTMLElement, navigation: HTMLElement): Layout | null {
  const surface = root.querySelector<HTMLElement>("[data-toc-surface]");
  if (!surface) return null;
  return {
    navigation: navigation.getBoundingClientRect(),
    surface: surface.getBoundingClientRect(),
    opacity: getComputedStyle(surface).opacity,
    rows: Array.from(
      navigation.querySelectorAll<HTMLElement>("li"),
      (node) => ({
        node,
        rect: node.getBoundingClientRect(),
      }),
    ),
  };
}

function revealCurrent(navigation: HTMLElement, expanded: boolean) {
  if (!expanded) {
    navigation.scrollTop = 0;
    return;
  }
  const link = navigation.querySelector<HTMLElement>(
    'a[aria-current="location"]',
  );
  if (!link) return;
  const viewport = navigation.getBoundingClientRect();
  const row = link.getBoundingClientRect();
  if (row.top < viewport.top) navigation.scrollTop -= viewport.top - row.top;
  else if (row.bottom > viewport.bottom)
    navigation.scrollTop += row.bottom - viewport.bottom;
}

const intersects = (row: DOMRect, viewport: DOMRect) =>
  row.bottom > viewport.top && row.top < viewport.bottom;

/** Measure each endpoint once; only transforms and opacity change between them. */
export function useArticleTocMotion(
  root: RefObject<HTMLDivElement | null>,
  navigation: RefObject<HTMLElement | null>,
  open: boolean,
  wide: boolean,
  current: string | undefined,
) {
  const before = useRef<Layout | null>(null);
  const animations = useRef<Animation[]>([]);
  const generation = useRef(0);
  const previousWide = useRef(wide);
  const capture = () => {
    before.current =
      root.current &&
      navigation.current &&
      !wide &&
      !matchMedia("(prefers-reduced-motion: reduce)").matches
        ? readLayout(root.current, navigation.current)
        : null;
  };

  useLayoutEffect(() => {
    const element = root.current;
    const nav = navigation.current;
    if (!element || !nav) return;
    if (previousWide.current !== wide) {
      generation.current++;
      animations.current.forEach((animation) => animation.cancel());
      animations.current = [];
      before.current = null;
      previousWide.current = wide;
    }
    const first = before.current;
    before.current = null;
    if (!first) {
      if (
        !animations.current.some(
          (animation) => animation.playState === "running",
        )
      )
        revealCurrent(nav, open || wide);
      return;
    }
    const id = ++generation.current;
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
    revealCurrent(nav, open || wide);
    if (wide || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const last = readLayout(element, nav);
    const surface = element.querySelector<HTMLElement>("[data-toc-surface]");
    if (!last || !surface) return;
    const style = getComputedStyle(element);
    const timing: KeyframeAnimationOptions = {
      duration: Number.parseFloat(
        style.getPropertyValue("--toc-motion-duration"),
      ),
      easing: style.getPropertyValue("--toc-motion-easing").trim(),
    };
    const animate = (node: HTMLElement, keyframes: Keyframe[]) => {
      animations.current.push(node.animate(keyframes, timing));
    };
    // Read all geometry before creating animations, avoiding interleaved layout reads/writes.
    const previousRows = new Map(first.rows.map((row) => [row.node, row.rect]));
    const rows = last.rows.flatMap(({ node, rect }) => {
      const previous = previousRows.get(node);
      if (
        !previous ||
        (!intersects(previous, first.navigation) &&
          !intersects(rect, last.navigation))
      )
        return [];
      return [
        {
          node,
          y:
            previous.top -
            first.navigation.top -
            (rect.top - last.navigation.top),
        },
      ];
    });
    animate(nav, [
      {
        transform: `translate(${first.navigation.left - last.navigation.left}px, ${first.navigation.top - last.navigation.top}px)`,
      },
      { transform: "none" },
    ]);
    for (const { node, y } of rows) {
      if (Math.abs(y) > 0.5)
        animate(node, [
          { transform: `translateY(${y}px)` },
          { transform: "none" },
        ]);
    }
    animate(surface, [
      {
        transform: `translate(${first.surface.left - last.surface.left}px, ${first.surface.top - last.surface.top}px) scale(${first.surface.width / last.surface.width}, ${first.surface.height / last.surface.height})`,
        opacity: first.opacity,
      },
      { transform: "none", opacity: last.opacity },
    ]);
    void Promise.allSettled(
      animations.current.map((animation) => animation.finished),
    ).then(() => {
      if (generation.current !== id) return;
      animations.current = [];
      if (navigation.current) revealCurrent(navigation.current, open || wide);
    });
  }, [open, wide, current, root, navigation]);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const cancel = () => {
      generation.current++;
      animations.current.forEach((animation) => animation.cancel());
      animations.current = [];
      before.current = null;
    };
    const update = () => {
      if (preference.matches) cancel();
    };
    preference.addEventListener("change", update);
    return () => {
      preference.removeEventListener("change", update);
      cancel();
    };
  }, []);
  return capture;
}
