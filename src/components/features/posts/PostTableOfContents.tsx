"use client";

import { List } from "lucide-react";
import { useEffect, useState } from "react";

import type { MarkdownHeading } from "@/lib/shared/utils/markdown";
import { cn } from "@/lib/shared/utils/tailwind";

const ACTIVE_HEADING_OFFSET = 104;
interface Props {
  headings: MarkdownHeading[];
  title: string;
  className?: string;
}

export default function PostTableOfContents({
  headings,
  title,
  className = "",
}: Props) {
  const [activeId, setActiveId] = useState(headings[0]?.id || "");

  useEffect(() => {
    if (headings.length === 0) return;

    const headingElements = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((element): element is HTMLElement => element !== null);

    if (headingElements.length === 0) return;

    let frame = 0;

    const updateActiveHeading = () => {
      frame = 0;

      const activeHeading =
        headingElements.findLast(
          (element) =>
            element.getBoundingClientRect().top <= ACTIVE_HEADING_OFFSET,
        ) || headingElements[0];

      setActiveId(activeHeading.id);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = requestAnimationFrame(updateActiveHeading);
    };

    updateActiveHeading();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label={title} className={cn("w-56 p-3 text-sm", className)}>
      <div className="mb-3 flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
        <List className="h-4 w-4" />
        <span>{title}</span>
      </div>
      <ol className="border-l border-zinc-200 pl-3 dark:border-zinc-700">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className="group/toc-item relative py-1"
            style={{
              paddingLeft: `${Math.max(heading.depth - 2, 0) * 0.75}rem`,
            }}
          >
            <span
              className={cn(
                "absolute top-0 bottom-0 -left-3.25 w-px bg-sky-600 opacity-0 transition-opacity group-hover/toc-item:opacity-100 dark:bg-sky-300",
                activeId === heading.id && "opacity-100",
              )}
            />
            <a
              href={`#${heading.id}`}
              onClick={() => setActiveId(heading.id)}
              className={cn(
                "block truncate text-zinc-500 transition-colors hover:text-sky-700 dark:text-zinc-400 dark:hover:text-sky-200",
                activeId === heading.id &&
                  "font-medium text-sky-700 dark:text-sky-200",
              )}
              title={heading.text}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
