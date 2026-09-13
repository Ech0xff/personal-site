import { useMotionValue } from "framer-motion";
import Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

import { motionToken } from "../_design/tokens.stylex";

export function useDeskScroll(locked: boolean) {
  const instance = useRef<Lenis | null>(null);
  const lock = useRef(locked);
  const progress = useMotionValue(0);
  const [scrollable, setScrollable] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const configure = () => {
      instance.current?.destroy();
      instance.current = null;
      if (preference.matches) return;
      const lenis = new Lenis({
        autoRaf: true,
        lerp: motionToken.scrollLerp,
        smoothWheel: true,
        syncTouch: false,
        anchors: true,
        stopInertiaOnNavigate: true,
      });
      instance.current = lenis;
      if (lock.current) lenis.stop();
    };
    configure();
    preference.addEventListener("change", configure);
    return () => {
      preference.removeEventListener("change", configure);
      instance.current?.destroy();
      instance.current = null;
    };
  }, []);

  useEffect(() => {
    lock.current = locked;
    if (locked) instance.current?.stop();
    else instance.current?.start();
  }, [locked]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const limit = document.documentElement.scrollHeight - window.innerHeight;
      setScrollable(limit > 1);
      setScrolled(window.scrollY > 8);
      progress.set(
        limit > 1 ? Math.max(0, Math.min(1, window.scrollY / limit)) : 0,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [progress]);

  return { progress, scrollable, scrolled };
}
