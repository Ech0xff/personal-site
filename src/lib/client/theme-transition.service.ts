"use client";

import {
  THEME_ATTRIBUTE,
  THEME_PREFERENCE_ATTRIBUTE,
} from "#lib/shared/theme/theme.const";
import type {
  ResolvedTheme,
  ThemePreference,
} from "#lib/shared/theme/theme.type";

let activeTransition: ViewTransition | undefined;
let resumeAnimations: (() => void) | undefined;

export const isThemeTransitioning = (): boolean =>
  document.documentElement.hasAttribute("data-theme-transition");

export const transitionTheme = (update: () => void, duration: number): void => {
  activeTransition?.skipTransition();
  resumeAnimations?.();

  if (
    duration === 0 ||
    typeof document.startViewTransition !== "function" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    update();
    return;
  }

  const root = document.documentElement;
  const animations = document
    .getAnimations()
    .filter((animation) => animation.playState === "running");
  animations.forEach((animation) => animation.pause());
  root.setAttribute("data-theme-transition", "");
  root.style.setProperty("--theme-transition-duration", `${duration}ms`);

  const transition = document.startViewTransition(update);
  activeTransition = transition;
  const cleanup = () => {
    if (activeTransition !== transition) return;
    root.removeAttribute("data-theme-transition");
    root.style.removeProperty("--theme-transition-duration");
    // Local CSS transitions canceled by transition: none must stay canceled.
    animations
      .filter((animation) => animation.playState === "paused")
      .forEach((animation) => animation.play());
    activeTransition = undefined;
    resumeAnimations = undefined;
  };
  resumeAnimations = cleanup;
  void transition.finished.then(cleanup, cleanup);
};

export const applyTheme = (
  preference: ThemePreference,
  resolved: ResolvedTheme,
): void => {
  const root = document.documentElement;
  root.setAttribute(THEME_PREFERENCE_ATTRIBUTE, preference);
  root.setAttribute(THEME_ATTRIBUTE, resolved);
  root.style.colorScheme = resolved;
};
