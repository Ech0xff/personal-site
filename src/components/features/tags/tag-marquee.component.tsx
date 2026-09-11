"use client";

import { Tag } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import type { TagWithCount } from "#types";

import { getTagMarqueeDuration } from "./tag-marquee.helper";

import "./tag-marquee.component.scss";

type Props = {
  tags: TagWithCount[];
};

import { DEFAULT_TAG_COLOR } from "#components/features/tags/tag.const";
const MIN_ROW_ITEMS = 20;

const getTagColor = (tag: TagWithCount) => {
  if (!tag.meta || typeof tag.meta !== "object" || Array.isArray(tag.meta)) {
    return DEFAULT_TAG_COLOR;
  }

  const color = tag.meta.color;
  return typeof color === "string" && color.trim() ? color : DEFAULT_TAG_COLOR;
};

const sortTags = (tags: TagWithCount[]) =>
  [...tags].sort((a, b) => b.count - a.count);

const expandRow = (tags: TagWithCount[]) => {
  if (tags.length === 0) return [];

  const copies = Math.max(2, Math.ceil(MIN_ROW_ITEMS / tags.length));
  return Array.from({ length: copies }, (_, copy) =>
    tags.map((tag) => ({ tag, key: `${copy}-${tag.id}` })),
  ).flat();
};

function TagCard({ tag }: { tag: TagWithCount }) {
  const color = getTagColor(tag);

  return (
    <div
      style={
        { "--tag-color": color } as CSSProperties & { "--tag-color": string }
      }
      className="group/tag relative h-[4.6rem] min-w-[8.5rem] shrink-0 overflow-hidden rounded-[1.1rem] border border-border-default/80 bg-surface-panel px-3 py-3 "
    >
      <div
        className="absolute inset-y-0 right-0 w-10 bg-linear-to-l from-surface-muted/80 to-transparent opacity-90 "
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-8 -left-8 h-16 w-16 rounded-full opacity-0 transition duration-500 ease-out group-hover/tag:translate-x-2 group-hover/tag:-translate-y-1 group-hover/tag:opacity-100 dark:hidden"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--tag-color) 40%, transparent)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-8 -left-8 hidden h-16 w-16 rounded-full opacity-0 transition duration-500 ease-out group-hover/tag:translate-x-2 group-hover/tag:-translate-y-1 group-hover/tag:opacity-100 dark:block"
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--tag-color) 70%, transparent)",
        }}
        aria-hidden="true"
      />
      <div className="relative grid h-full grid-rows-[1fr_auto]">
        <div
          className="line-clamp-1 text-[1.05rem] leading-none font-black tracking-tight"
          style={{ color: "var(--tag-color)" }}
        >
          {tag.name}
        </div>
        <div className="flex items-end justify-between gap-3">
          <span className="relative z-10 text-lg leading-none font-bold text-text-muted">
            {tag.count}
          </span>
          <Tag
            className="h-[1.35rem] w-[1.35rem] shrink-0 rotate-[90deg] opacity-75 transition-transform duration-500 group-hover/tag:rotate-[70deg]"
            style={{
              color: "color-mix(in srgb, var(--tag-color) 67%, transparent)",
            }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({
  direction,
  tags,
}: {
  direction: "left" | "right";
  tags: TagWithCount[];
}) {
  const expanded = expandRow(tags);
  const duplicated = ["original", "duplicate"].flatMap((group) =>
    expanded.map(({ tag, key }) => ({ tag, key: `${group}-${key}` })),
  );
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const trackStyle:
    | (CSSProperties & { "--tag-marquee-duration": string })
    | undefined = duration
    ? { "--tag-marquee-duration": `${duration}s` }
    : undefined;

  useEffect(() => {
    const element = trackRef.current;
    if (!element) return;

    const updateDuration = () => {
      setDuration(getTagMarqueeDuration(element.scrollWidth));
    };

    updateDuration();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      updateDuration();
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="tag-marquee-row overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div
        ref={trackRef}
        className={[
          "tag-marquee-track flex w-max gap-3",
          direction === "left"
            ? "tag-marquee-track-left"
            : "tag-marquee-track-right",
        ].join(" ")}
        style={trackStyle}
      >
        {duplicated.map(({ tag, key }) => (
          <TagCard key={key} tag={tag} />
        ))}
      </div>
    </div>
  );
}

export default function TagMarquee({ tags }: Props) {
  if (tags.length === 0) return null;

  const sortedTags = sortTags(tags);

  return (
    <section className="space-y-3">
      <MarqueeRow direction="left" tags={sortedTags} />
      <MarqueeRow direction="right" tags={sortedTags} />
    </section>
  );
}
