"use client";

import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

type Rotation = {
  x: number;
  y: number;
};

type PointerDirection = {
  x: number;
  y: number;
};

type SpherePoint = {
  x: number;
  y: number;
  z: number;
};

type TagProjection = {
  color: string;
  depth: number;
  opacity: number;
  scale: number;
  x: number;
  y: number;
};

type ReturningTag = {
  from: TagProjection;
  startedAt: number;
};

type HoveringTag = {
  from: TagProjection;
  startedAt: number;
  to: TagProjection;
};

export type TagSphereItem = {
  count: number;
  id: string;
  meta?: unknown;
  name: string;
};

type Props<T extends TagSphereItem> = {
  className?: string;
  onTagClick?: (tag: T) => void;
  speed?: number;
  tags: T[];
};

const defaultTagColor = "#71717a";

const getSpherePoint = (index: number, total: number): SpherePoint => {
  if (total <= 1) return { x: 0, y: 0, z: 1 };

  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const y = 1 - (index / (total - 1)) * 2;
  const radius = Math.sqrt(1 - y * y);
  const theta = goldenAngle * index;

  return {
    x: Math.cos(theta) * radius,
    y,
    z: Math.sin(theta) * radius,
  };
};

const rotatePoint = (point: SpherePoint, rotation: Rotation): SpherePoint => {
  const cosX = Math.cos(rotation.x);
  const sinX = Math.sin(rotation.x);
  const cosY = Math.cos(rotation.y);
  const sinY = Math.sin(rotation.y);

  const y = point.y * cosX - point.z * sinX;
  const zAfterX = point.y * sinX + point.z * cosX;
  const x = point.x * cosY + zAfterX * sinY;
  const z = -point.x * sinY + zAfterX * cosY;

  return { x, y, z };
};

const lerp = (from: number, to: number, progress: number) => {
  return from + (to - from) * progress;
};

const easeOutCubic = (progress: number) => {
  return 1 - (1 - progress) ** 3;
};

const getTagProjection = (
  point: SpherePoint,
  color: string,
  size: { height: number; width: number },
  rotation: Rotation,
): TagProjection => {
  const rotated = rotatePoint(point, rotation);
  const depth = (rotated.z + 1) / 2;
  const scale = 0.62 + depth * 0.58;

  return {
    color,
    depth,
    opacity: 0.18 + depth * 0.82,
    scale,
    x: rotated.x * size.width * 0.32,
    y: rotated.y * size.height * 0.38,
  };
};

const getTagColor = (tag: TagSphereItem) => {
  if (!tag.meta || typeof tag.meta !== "object" || Array.isArray(tag.meta)) {
    return defaultTagColor;
  }

  const color = (tag.meta as { color?: unknown }).color;
  return typeof color === "string" && color.trim() ? color : defaultTagColor;
};

const getFontSize = (count: number, maxCount: number) => {
  const weight = maxCount > 0 ? count / maxCount : 0;
  return 16 + Math.round(weight * 18);
};

const interpolateProjection = (
  from: TagProjection,
  to: TagProjection,
  progress: number,
): TagProjection => {
  const easedProgress = easeOutCubic(progress);
  return {
    color: to.color,
    depth: lerp(from.depth, to.depth, easedProgress),
    opacity: lerp(from.opacity, to.opacity, easedProgress),
    scale: lerp(from.scale, to.scale, easedProgress),
    x: lerp(from.x, to.x, easedProgress),
    y: lerp(from.y, to.y, easedProgress),
  };
};

const getHoverProjection = (projection: TagProjection): TagProjection => {
  return {
    ...projection,
    depth: 1,
    opacity: 1,
    scale: Math.max(projection.scale, 1.2),
  };
};

const getTransform = (projection: TagProjection) => {
  return `translate3d(${projection.x}px, ${projection.y}px, 0) scale(${projection.scale})`;
};

const projectionToStyle = (
  projection: TagProjection,
  fontSize: number,
): CSSProperties => {
  return {
    alignSelf: "center",
    color: projection.color,
    fontSize: `${fontSize}px`,
    gridArea: "1 / 1",
    justifySelf: "center",
    opacity: projection.opacity,
    transform: getTransform(projection),
    willChange: "transform, opacity",
  };
};

const applyProjection = (
  element: HTMLButtonElement,
  projection: TagProjection,
) => {
  element.style.opacity = String(projection.opacity);
  element.style.transform = getTransform(projection);
};

export default function TagSphere<T extends TagSphereItem>({
  className,
  onTagClick,
  speed = 0.00012,
  tags,
}: Props<T>) {
  const [mounted, setMounted] = useState(false);
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentProjectionsRef = useRef<Record<string, TagProjection>>({});
  const frozenTagProjectionsRef = useRef<Record<string, TagProjection>>({});
  const hoveringTagsRef = useRef<Record<string, HoveringTag>>({});
  const pointerDirectionRef = useRef<PointerDirection>({
    x: 1,
    y: 0.5,
  });
  const returningTagsRef = useRef<Record<string, ReturningTag>>({});
  const rotationRef = useRef<Rotation>({ x: 0.15, y: 0 });
  const sizeRef = useRef({ height: 560, width: 560 });
  const maxCount = Math.max(...tags.map((tag) => tag.count), 0);
  const points = useMemo(
    () => tags.map((_, index) => getSpherePoint(index, tags.length)),
    [tags],
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let frameId = 0;
    let previousTime = performance.now();
    const updateSize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      sizeRef.current = {
        height: rect.height,
        width: rect.width,
      };
    };
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateSize);

    updateSize();
    if (containerRef.current) resizeObserver?.observe(containerRef.current);

    const rotate = (time: number) => {
      const delta = Math.min(time - previousTime, 32);
      previousTime = time;
      const pointerDirection = pointerDirectionRef.current;

      rotationRef.current = {
        x: rotationRef.current.x - pointerDirection.y * speed * delta,
        y: rotationRef.current.y + pointerDirection.x * speed * delta,
      };

      tags.forEach((tag, index) => {
        const element = buttonRefs.current[tag.id];
        if (!element) return;

        const liveProjection = getTagProjection(
          points[index],
          getTagColor(tag),
          sizeRef.current,
          rotationRef.current,
        );
        const returningTag = returningTagsRef.current[tag.id];
        const returningProgress = returningTag
          ? Math.min((time - returningTag.startedAt) / 520, 1)
          : 0;
        const hoveringTag = hoveringTagsRef.current[tag.id];
        const hoveringProgress = hoveringTag
          ? Math.min((time - hoveringTag.startedAt) / 220, 1)
          : 0;
        const frozenProjection = frozenTagProjectionsRef.current[tag.id];
        const projection = frozenProjection
          ? hoveringTag
            ? interpolateProjection(
                hoveringTag.from,
                hoveringTag.to,
                hoveringProgress,
              )
            : frozenProjection
          : returningTag
            ? interpolateProjection(
                returningTag.from,
                liveProjection,
                returningProgress,
              )
            : liveProjection;

        currentProjectionsRef.current[tag.id] = projection;
        applyProjection(element, projection);

        if (hoveringTag && hoveringProgress >= 1) {
          delete hoveringTagsRef.current[tag.id];
        }

        if (returningTag && returningProgress >= 1) {
          delete returningTagsRef.current[tag.id];
        }
      });

      frameId = requestAnimationFrame(rotate);
    };

    frameId = requestAnimationFrame(rotate);
    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
    };
  }, [mounted, points, speed, tags]);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    const distance = Math.hypot(x, y);

    if (distance < 0.001) {
      pointerDirectionRef.current = { x: 1, y: 0.5 };
      return;
    }

    pointerDirectionRef.current = {
      x: x / distance,
      y: y / distance,
    };
  };

  const freezeTag = (tagId: string, projection: TagProjection) => {
    delete returningTagsRef.current[tagId];

    if (!frozenTagProjectionsRef.current[tagId]) {
      const hoverProjection = getHoverProjection(projection);
      frozenTagProjectionsRef.current[tagId] = hoverProjection;
      hoveringTagsRef.current[tagId] = {
        from: projection,
        startedAt: performance.now(),
        to: hoverProjection,
      };
    }

    Object.entries(buttonRefs.current).forEach(([id, element]) => {
      if (element) element.style.pointerEvents = id === tagId ? "auto" : "none";
    });
  };

  const releaseTag = (tagId: string) => {
    const currentProjection = currentProjectionsRef.current[tagId];
    delete frozenTagProjectionsRef.current[tagId];
    delete hoveringTagsRef.current[tagId];

    if (currentProjection) {
      returningTagsRef.current[tagId] = {
        from: currentProjection,
        startedAt: performance.now(),
      };
    }

    Object.values(buttonRefs.current).forEach((element) => {
      if (element) element.style.pointerEvents = "auto";
    });
  };

  return (
    <div
      className={className}
      onMouseLeave={() => {
        pointerDirectionRef.current = { x: 1, y: 0.5 };
      }}
      onMouseMove={handleMouseMove}
      ref={containerRef}
      style={{ display: "grid", placeItems: "center" }}
    >
      {mounted &&
        tags.map((tag, index) => {
          const initialProjection = getTagProjection(
            points[index],
            getTagColor(tag),
            sizeRef.current,
            rotationRef.current,
          );

          return (
            <button
              key={tag.id}
              ref={(element) => {
                buttonRefs.current[tag.id] = element;
              }}
              type="button"
              title={`${tag.name}: ${tag.count}`}
              className="cursor-pointer whitespace-nowrap rounded px-2 py-1 font-semibold tracking-normal transition-colors duration-200 hover:bg-zinc-900/10 hover:opacity-100 focus-visible:bg-zinc-900/10 focus-visible:outline-none dark:focus-visible:bg-white/10 dark:hover:bg-white/10"
              onBlur={() => releaseTag(tag.id)}
              onClick={() => onTagClick?.(tag)}
              onFocus={() =>
                freezeTag(
                  tag.id,
                  currentProjectionsRef.current[tag.id] ?? initialProjection,
                )
              }
              onMouseEnter={() =>
                freezeTag(
                  tag.id,
                  currentProjectionsRef.current[tag.id] ?? initialProjection,
                )
              }
              onMouseLeave={() => releaseTag(tag.id)}
              style={projectionToStyle(
                initialProjection,
                getFontSize(tag.count, maxCount),
              )}
            >
              {tag.name}
            </button>
          );
        })}
    </div>
  );
}
