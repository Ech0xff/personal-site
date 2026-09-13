"use client";
import * as stylex from "@stylexjs/stylex";
import { List } from "lucide-react";
import { useId } from "react";

import type { ArticleHeading } from "#lib/shared/content/article.helper";

import { ViewportOverlay } from "../../../_components/layout/viewport-overlay.component";
import { foundation } from "../../../_design/foundation.style";
import { useArticleToc } from "./article-toc.hook";
import { tocStyles as styles } from "./article-toc.style";

export function ArticleToc({
  headings,
}: Readonly<{ headings: readonly ArticleHeading[] }>) {
  const toc = useArticleToc(headings);
  const id = useId();
  const minimumLevel = Math.min(...headings.map((heading) => heading.level));
  return (
    <ViewportOverlay>
      <div
        ref={toc.root}
        data-article-toc
        data-expanded={toc.expanded}
        {...stylex.props(
          styles.root,
          styles.height(headings.length),
          toc.open && !toc.wide && styles.expanded,
        )}
        onPointerEnter={toc.enter}
        onPointerLeave={toc.leave}
        onPointerDownCapture={toc.pointerDown}
        onKeyDownCapture={toc.keyboardInteraction}
        onBlur={toc.blur}
      >
        <div
          aria-hidden="true"
          data-toc-surface
          {...stylex.props(styles.surface, toc.open && styles.surfaceExpanded)}
        />
        <button
          ref={toc.trigger}
          type="button"
          aria-label="Open table of contents"
          aria-expanded={toc.expanded}
          aria-controls={id}
          tabIndex={toc.expanded ? -1 : 0}
          onClick={toc.toggle}
          onKeyDown={toc.keyDown}
          onFocus={toc.focus}
          {...stylex.props(
            styles.trigger,
            toc.open && styles.triggerHidden,
            foundation.focus,
          )}
        />
        <div
          aria-hidden={!toc.expanded}
          {...stylex.props(styles.header, toc.open && styles.headerExpanded)}
        >
          <List size={15} aria-hidden="true" />
          <span>Contents</span>
        </div>
        <nav
          ref={toc.navigation}
          id={id}
          aria-label="Article sections"
          aria-hidden={!toc.expanded}
          inert={!toc.expanded}
          data-lenis-prevent
          {...stylex.props(
            styles.navigation,
            toc.open && styles.navigationExpanded,
          )}
        >
          <ol {...stylex.props(styles.list)}>
            {headings.map((heading, index) => {
              const visible = toc.visible.includes(heading.id);
              const strength = visible
                ? Math.exp(
                    -((index - toc.peak) ** 2) /
                      Math.max(1, toc.visible.length),
                  )
                : 0;
              const current = toc.current === heading.id;
              return (
                <li
                  key={heading.id}
                  {...stylex.props(styles.row, toc.open && styles.rowExpanded)}
                >
                  <a
                    href={`#${encodeURIComponent(heading.id)}`}
                    title={heading.text}
                    aria-current={current ? "location" : undefined}
                    data-visible={visible}
                    onClick={toc.select}
                    {...stylex.props(
                      styles.link,
                      visible && styles.current,
                      foundation.focus,
                    )}
                  >
                    <span
                      aria-hidden="true"
                      {...stylex.props(
                        styles.indicator(strength),
                        toc.open && styles.indicatorExpanded,
                        visible && styles.indicatorCurrent,
                        toc.open && visible && styles.indicatorCurrentExpanded,
                      )}
                    />
                    <span
                      {...stylex.props(
                        styles.text(heading.level - minimumLevel),
                        toc.open && styles.textExpanded(index),
                      )}
                    >
                      {heading.text}
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </ViewportOverlay>
  );
}
