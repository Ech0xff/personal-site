import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import type { ArticleHeading } from "#lib/shared/content/article.helper";

import { useArticleTocMotion } from "./article-toc-motion.hook";

export function useArticleToc(headings: readonly ArticleHeading[]) {
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [wide, setWide] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const skipFocus = useRef(false);
  const focusLink = useRef(false);
  const hoverOpened = useRef(false);
  const pointerFocus = useRef(false);
  const [reading, setReading] = useState<
    Readonly<{ visible: readonly string[]; current: string | undefined }>
  >({ visible: [], current: undefined });
  const captureMotion = useArticleTocMotion(
    root,
    navigation,
    open,
    wide,
    reading.current,
  );
  const changeOpen = (next: boolean) => {
    if (next === open) return;
    captureMotion();
    setOpen(next);
  };
  const clearClose = () => clearTimeout(closeTimer.current);
  const close = (restoreFocus = false) => {
    clearClose();
    hoverOpened.current = false;
    if (restoreFocus) {
      skipFocus.current = true;
      trigger.current?.focus({ preventScroll: true });
      skipFocus.current = false;
    }
    changeOpen(false);
  };
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1280px)");
    const update = () => {
      setWide(query.matches);
      setOpen(false);
    };
    update();
    query.addEventListener("change", update);
    return () => {
      query.removeEventListener("change", update);
      clearTimeout(closeTimer.current);
    };
  }, []);
  useEffect(() => {
    if (open && focusLink.current) {
      focusLink.current = false;
      const link =
        navigation.current?.querySelector<HTMLAnchorElement>(
          'a[aria-current="location"]',
        ) ?? navigation.current?.querySelector<HTMLAnchorElement>("a");
      link?.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    const article = document.getElementById("post-article");
    if (!article) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const header =
        document.querySelector("header")?.getBoundingClientRect().height ?? 76;
      const nodes = headings.map((heading) =>
        document.getElementById(heading.id),
      );
      const positions = nodes.map(
        (node) => node?.getBoundingClientRect().top ?? Infinity,
      );
      const body = article.querySelector("[data-article-body]") ?? article;
      const rect = body.getBoundingClientRect();
      const bottom = rect.bottom;
      const element = root.current;
      if (element) {
        const available = Math.max(
          0,
          Math.min(rect.height, window.innerHeight - header - 48),
        );
        element.style.setProperty("--toc-available-height", `${available}px`);
        const height = Math.min(
          element.getBoundingClientRect().height,
          available,
        );
        // The reading rail stays visible after the body center scrolls above the viewport.
        const top = Math.max(
          header + 16,
          Math.min(
            rect.top + rect.height / 2 - height / 2,
            (window.innerHeight - height) / 2,
          ),
        );
        element.style.setProperty("--toc-top", `${top}px`);
      }
      const visible = headings
        .filter(
          (_, index) =>
            positions[index] < window.innerHeight &&
            (positions[index + 1] ?? bottom) > header,
        )
        .map((heading) => heading.id);
      const current =
        headings.findLast((_, index) => positions[index] <= header + 24)?.id ??
        visible[0];
      setReading((previous) =>
        previous.current === current &&
        previous.visible.join() === visible.join()
          ? previous
          : { visible, current },
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const restoreHash = () => {
      let id: string;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      if (headings.some((heading) => heading.id === id))
        document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
      schedule();
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(article);
    if (root.current) observer.observe(root.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("popstate", restoreHash);
    restoreHash();
    schedule();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("popstate", restoreHash);
    };
  }, [headings]);
  const dismiss = useEffectEvent((restoreFocus: boolean) =>
    close(restoreFocus),
  );
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        dismiss(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismiss(true);
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  const visibleIndices = headings.flatMap((heading, index) =>
    reading.visible.includes(heading.id) ? [index] : [],
  );
  const peak = visibleIndices.length
    ? Math.round(
        (visibleIndices[0] + visibleIndices[visibleIndices.length - 1]) / 2,
      )
    : Math.max(
        0,
        headings.findIndex((heading) => heading.id === reading.current),
      );
  const enter = (event: ReactPointerEvent) => {
    clearClose();
    if (!wide && event.pointerType === "mouse") {
      hoverOpened.current = !open;
      changeOpen(true);
    }
  };
  const leave = (event: ReactPointerEvent) => {
    if (event.pointerType !== "mouse") return;
    clearClose();
    if (!navigation.current?.querySelector(":focus-visible"))
      closeTimer.current = setTimeout(() => close(), 160);
  };
  const blur = (event: FocusEvent) => {
    // WebKit can blur the trigger to the body before dispatching an internal tap's click.
    const internalPointerBlur =
      pointerFocus.current && event.relatedTarget === null;
    pointerFocus.current = false;
    if (internalPointerBlur) return;
    if (!event.currentTarget.contains(event.relatedTarget)) close();
  };
  const focus = () => {
    if (
      skipFocus.current ||
      pointerFocus.current ||
      wide ||
      !trigger.current?.matches(":focus-visible")
    )
      return;
    clearClose();
    focusLink.current = true;
    changeOpen(true);
  };
  const toggle = (event: MouseEvent) => {
    clearClose();
    pointerFocus.current = false;
    if (hoverOpened.current) {
      hoverOpened.current = false;
      return;
    }
    if (open) close();
    else {
      focusLink.current = event.detail === 0;
      changeOpen(true);
    }
  };
  const keyDown = (event: ReactKeyboardEvent) => {
    pointerFocus.current = false;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusLink.current = true;
      changeOpen(true);
    }
  };
  const select = () => {
    if (!wide) close(true);
  };
  const pointerDown = () => {
    pointerFocus.current = true;
    clearClose();
  };
  const keyboardInteraction = () => {
    pointerFocus.current = false;
  };
  return {
    root,
    trigger,
    navigation,
    open,
    wide,
    expanded: wide || open,
    peak,
    enter,
    leave,
    blur,
    focus,
    toggle,
    pointerDown,
    keyboardInteraction,
    keyDown,
    select,
    ...reading,
  };
}
