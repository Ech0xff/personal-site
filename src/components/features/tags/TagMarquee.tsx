"use client";

import { Tag } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import type { TagWithCount } from "@/types";

import { getTagMarqueeDuration } from "./tag-marquee-utils";

type Props = {
  tags: TagWithCount[];
};

const defaultTagColor = "#71717a";
const MIN_ROW_ITEMS = 20;

const getTagColor = (tag: TagWithCount) => {
  if (!tag.meta || typeof tag.meta !== "object" || Array.isArray(tag.meta)) {
    return defaultTagColor;
  }

  const color = (tag.meta as { color?: unknown }).color;
  return typeof color === "string" && color.trim() ? color : defaultTagColor;
};

const sortTags = (tags: TagWithCount[]) =>
  [...tags].sort((a, b) => b.count - a.count);

const expandRow = (tags: TagWithCount[]) => {
  if (tags.length === 0) return [];

  const copies = Math.max(2, Math.ceil(MIN_ROW_ITEMS / tags.length));
  return Array.from({ length: copies }, () => tags).flat();
};

function TagCard({ tag }: { tag: TagWithCount }) {
  const color = getTagColor(tag);

  return (
    <div className="group/tag relative h-[4.6rem] min-w-[8.5rem] shrink-0 overflow-hidden rounded-[1.1rem] border border-slate-200/80 bg-white px-3 py-3 dark:border-white/8 dark:bg-zinc-900">
      <div
        className="absolute inset-y-0 right-0 w-10 bg-linear-to-l from-slate-100/80 to-transparent opacity-90 dark:from-black/10"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-8 -left-8 h-16 w-16 rounded-full opacity-0 transition-all duration-500 ease-out group-hover/tag:translate-x-2 group-hover/tag:-translate-y-1 group-hover/tag:opacity-100 dark:hidden"
        style={{ backgroundColor: `${color}66` }}
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-8 -left-8 hidden h-16 w-16 rounded-full opacity-0 transition-all duration-500 ease-out group-hover/tag:translate-x-2 group-hover/tag:-translate-y-1 group-hover/tag:opacity-100 dark:block"
        style={{ backgroundColor: `${color}b3` }}
        aria-hidden="true"
      />
      <div className="relative grid h-full grid-rows-[1fr_auto]">
        <div
          className="line-clamp-1 font-black text-[1.05rem] leading-none tracking-tight"
          style={{ color }}
        >
          {tag.name}
        </div>
        <div className="flex items-end justify-between gap-3">
          <span className="relative z-10 font-bold text-lg text-slate-500 leading-none dark:text-white/55">
            {tag.count}
          </span>
          <Tag
            className="h-[1.35rem] w-[1.35rem] shrink-0 rotate-[90deg] opacity-75 transition-transform duration-500 group-hover/tag:rotate-[70deg]"
            style={{
              color: `${color}aa`,
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
  const duplicated = [...expanded, ...expanded];
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState<number | null>(null);

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
        style={
          duration
            ? ({ "--tag-marquee-duration": `${duration}s` } as CSSProperties)
            : undefined
        }
      >
        {duplicated.map((tag, index) => (
          <TagCard key={`${direction}-${tag.id}-${index}`} tag={tag} />
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
