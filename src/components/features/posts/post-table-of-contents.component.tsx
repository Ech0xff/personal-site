"use client";

import { List } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { MarkdownHeading } from "#lib/shared/utils/markdown.helper";
import { cn } from "#lib/shared/utils/tailwind.helper";

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
  const listRef = useRef<HTMLOListElement>(null);

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

  useEffect(() => {
    if (!activeId) return;

    const listElement = listRef.current;
    const activeElement = listElement?.querySelector<HTMLLIElement>(
      `[data-heading-id="${CSS.escape(activeId)}"]`,
    );

    if (!listElement || !activeElement) return;

    const listRect = listElement.getBoundingClientRect();
    const activeRect = activeElement.getBoundingClientRect();
    const padding = 12;

    if (activeRect.top < listRect.top + padding) {
      listElement.scrollTop -= listRect.top + padding - activeRect.top;
      return;
    }

    if (activeRect.bottom > listRect.bottom - padding) {
      listElement.scrollTop += activeRect.bottom - (listRect.bottom - padding);
    }
  }, [activeId]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label={title} className={cn("w-56 p-3 text-sm", className)}>
      <div className="mb-3 flex items-center gap-2 font-semibold text-text-primary">
        <List className="h-4 w-4" />
        <span>{title}</span>
      </div>
      <ol
        ref={listRef}
        className="max-h-[calc(100dvh-6rem-1.5rem-2.75rem)] overflow-auto"
      >
        {headings.map((heading) => (
          <li
            key={heading.id}
            data-heading-id={heading.id}
            className={cn(
              "relative border-l border-border-default py-1 pl-3 hover:border-info-border  ",
              activeId === heading.id && "border-info-border ",
            )}
          >
            <a
              href={`#${heading.id}`}
              onClick={() => setActiveId(heading.id)}
              className={cn(
                "block truncate text-text-muted transition-colors hover:text-info-text  ",
                activeId === heading.id && "font-medium text-info-text ",
              )}
              title={heading.text}
              style={{
                paddingLeft: `${Math.max(heading.depth - 2, 0) * 0.75}rem`,
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
