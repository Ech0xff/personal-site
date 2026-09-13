import { useAtom } from "jotai";
import { useEffect, useState } from "react";

import { clockFormatAtom } from "./clock.atom";
import { formatClock } from "./clock.helper";

export function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  const [format, setFormat] = useAtom(clockFormatAtom);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      clearTimeout(timer);
      if (document.hidden) return;
      setNow(new Date());
      timer = setTimeout(tick, 1000 - (Date.now() % 1000));
    };
    tick();
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, []);

  const toggle = () => {
    setFormat((value) => (value === "24h" ? "12h" : "24h"));
  };
  return { text: now ? formatClock(now, format) : "--:--:--", format, toggle };
}
