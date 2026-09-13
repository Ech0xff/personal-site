"use client";
import { flushSync } from "react-dom";

import { motionToken } from "#design/tokens.stylex";

let transition: ViewTransition | undefined;
let revision = 0;

/** Commit one complete appearance before the new snapshot is captured. */
export function applyThemeChange(apply: () => void, animate: boolean) {
  const current = ++revision;
  transition?.skipTransition();
  const commit = () => {
    if (current !== revision) return;
    flushSync(apply);
    // Resolve component color transitions before taking the new-theme snapshot.
    void document.documentElement.offsetWidth;
    for (const animation of document.getAnimations()) {
      if (
        typeof CSSTransition !== "undefined" &&
        animation instanceof CSSTransition &&
        /color|fill|stroke|shadow|background|filter/.test(
          animation.transitionProperty,
        )
      )
        animation.finish();
    }
  };
  if (!animate) {
    apply();
    return;
  }
  if (
    typeof document.startViewTransition !== "function" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.visibilityState !== "visible"
  ) {
    commit();
    return;
  }
  const active = document.startViewTransition(commit);
  transition = active;
  void active.ready
    .then(() => {
      for (const animation of document.getAnimations()) {
        const effect = animation.effect;
        if (
          effect instanceof KeyframeEffect &&
          effect.pseudoElement?.startsWith("::view-transition")
        ) {
          effect.updateTiming({
            duration: motionToken.themeDuration,
            easing: "ease-in-out",
          });
        }
      }
    })
    .catch(() => {
      /* A newer preference can skip an obsolete snapshot. */
    });
  void active.finished.finally(() => {
    if (transition === active) transition = undefined;
  });
}
