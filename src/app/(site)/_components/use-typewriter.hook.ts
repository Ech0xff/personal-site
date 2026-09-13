"use client";
import { useEffect, useRef, useState } from "react";

import { terminalLines } from "./desk-content.const";
import {
  advanceTypewriter,
  initialTypewriterState,
  typingTiming,
} from "./typewriter.helper";

export function useTypewriter(active = true) {
  const element = useRef<HTMLDivElement>(null);
  const [state, setState] = useState(initialTypewriterState);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(true);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduced(query.matches);
    const updateVisibility = () => setForeground(!document.hidden);
    updateMotion();
    updateVisibility();
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    if (element.current) observer.observe(element.current);
    query.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      query.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);
  const running = active && visible && foreground && !reduced;
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(
      () => setState((previous) => advanceTypewriter(previous, terminalLines)),
      typingTiming[state.phase],
    );
    return () => clearTimeout(timer);
  }, [running, state]);
  const text = reduced
    ? terminalLines[0]
    : Array.from(terminalLines[state.line]).slice(0, state.count).join("");
  return {
    element,
    text,
    running,
    reduced,
  };
}
