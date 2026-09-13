import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

import type { DisplayProgram } from "./display-content.schema";

export function useDisplayProgram(program: DisplayProgram) {
  const reduced = useReducedMotion();
  const [displayed, setDisplayed] = useState(program);

  useEffect(() => {
    if (displayed === program) return;
    // A newer selection cancels the pending swap during the fade-out.
    const timer = setTimeout(() => setDisplayed(program), reduced ? 0 : 140);
    return () => clearTimeout(timer);
  }, [displayed, program, reduced]);

  return {
    displayed: reduced ? program : displayed,
    changing: !reduced && displayed !== program,
  };
}
