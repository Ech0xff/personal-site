import { useEffect, useRef, useState } from "react";

export function useSignatureSize() {
  const code = useRef<HTMLSpanElement>(null);
  const design = useRef<HTMLSpanElement>(null);
  const [width, setWidth] = useState({ code: "2.5em", design: "3.6em" });
  useEffect(() => {
    const measure = () => {
      if (!code.current || !design.current) return;
      const next = {
        code: `${code.current.offsetWidth}px`,
        design: `${design.current.offsetWidth}px`,
      };
      setWidth((previous) =>
        previous.code === next.code && previous.design === next.design
          ? previous
          : next,
      );
    };
    const observer = new ResizeObserver(measure);
    if (code.current) observer.observe(code.current);
    if (design.current) observer.observe(design.current);
    measure();
    return () => observer.disconnect();
  }, []);
  return { code, design, width };
}
