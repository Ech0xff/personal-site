import { useMotionValue, useSpring } from "framer-motion";
import { useEffect, type PointerEvent } from "react";

import { motionToken } from "../_design/tokens.stylex";

const spring = {
  stiffness: motionToken.magneticStiffness,
  damping: motionToken.magneticDamping,
  mass: motionToken.magneticMass,
};
const offset = (distance: number) =>
  Math.max(
    -motionToken.magneticLimit,
    Math.min(
      motionToken.magneticLimit,
      distance * motionToken.magneticStrength,
    ),
  );

export function useMagnetic() {
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, spring);
  const y = useSpring(targetY, spring);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => {
      if (!preference.matches) return;
      targetX.set(0);
      targetY.set(0);
      x.jump(0);
      y.jump(0);
    };
    stop();
    preference.addEventListener("change", stop);
    return () => preference.removeEventListener("change", stop);
  }, [targetX, targetY, x, y]);

  const reset = () => {
    targetX.set(0);
    targetY.set(0);
  };
  const move = (event: PointerEvent<HTMLSpanElement>) => {
    if (
      matchMedia("(prefers-reduced-motion: reduce)").matches ||
      event.pointerType !== "mouse" ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    targetX.set(offset(event.clientX - bounds.left - bounds.width / 2));
    targetY.set(offset(event.clientY - bounds.top - bounds.height / 2));
  };
  return { x, y, move, reset };
}
