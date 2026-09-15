import { animate, useMotionValue } from "framer-motion";
import { useEffect, type RefObject } from "react";

import { color } from "#design/tokens.stylex";

type Mode = "idle" | "hover" | "handle" | "pressed" | "dragging";
const scales: Record<Mode, number> = {
  idle: 1,
  hover: 1.45,
  handle: 1.6,
  pressed: 0.78,
  dragging: 1.25,
};

export function useRingCursor(ref: RefObject<HTMLDivElement | null>) {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);
  const rippleScale = useMotionValue(1);
  const rippleOpacity = useMotionValue(0);
  useEffect(() => {
    const layer = ref.current;
    const visual = layer?.querySelector<HTMLElement>("[data-ring-visual]");
    if (!layer || !visual) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = preference.matches;
    let visible = false;
    let pressed = false;
    let mode: Mode = "idle";
    let pointer = { x: 0, y: 0 };
    let heldItem: Element | null = null;
    const setMode = (next: Mode, refresh = false) => {
      if (mode === next && !refresh) return;
      mode = next;
      layer.dataset.ringState = next;
      scale.stop();
      rotate.stop();
      visual.style.borderStyle = next === "dragging" ? "dashed" : "solid";
      visual.style.borderColor = next === "idle" ? color.text : color.accent;
      if (reduced) scale.set(scales[next]);
      else
        void animate(scale, scales[next], {
          type: "spring",
          stiffness: 440,
          damping: 24,
          mass: 0.55,
        });
      rotate.set(0);
      if (next === "dragging" && !reduced)
        void animate(rotate, 360, {
          duration: 2.4,
          ease: "linear",
          repeat: Infinity,
        });
    };
    const appearance = (target: EventTarget | null) => {
      if (pressed) {
        setMode(
          heldItem?.getAttribute("data-item-state") === "dragging"
            ? "dragging"
            : "pressed",
        );
        return;
      }
      const element = target instanceof Element ? target : null;
      const control = element?.closest(
        "a[href],button,input,textarea,select,[role=button],[role=slider],[data-item-drag-handle],[data-item-draggable=true]",
      );
      const enabled =
        control &&
        !control.matches(":disabled,[aria-disabled=true]") &&
        !control.closest("[inert]");
      setMode(
        enabled
          ? control.matches(
              "[data-item-drag-handle],[data-item-draggable=true]",
            )
            ? "handle"
            : "hover"
          : "idle",
      );
    };
    const observer = new MutationObserver(() => appearance(heldItem));
    const show = () => {
      if (!layer.matches(":popover-open")) layer.showPopover();
      layer.style.opacity = "1";
      document.documentElement.setAttribute("data-ring-cursor", "");
      visible = true;
    };
    const hide = () => {
      layer.style.opacity = "0";
      visible = false;
      pressed = false;
      heldItem = null;
      observer.disconnect();
      setMode("idle");
      rippleOpacity.stop();
      rippleScale.stop();
      rippleOpacity.set(0);
    };
    const mouse = (event: PointerEvent) => {
      if (event.pointerType === "mouse") return true;
      hide();
      document.documentElement.removeAttribute("data-ring-cursor");
      return false;
    };
    const move = (event: PointerEvent) => {
      if (!mouse(event)) return;
      pointer = { x: event.clientX, y: event.clientY };
      x.set(pointer.x);
      y.set(pointer.y);
      if (!visible) show();
      appearance(event.target);
    };
    const down = (event: PointerEvent) => {
      if (!mouse(event)) return;
      pressed = true;
      heldItem =
        event.target instanceof Element
          ? event.target.closest("[data-desk-item]")
          : null;
      observer.disconnect();
      if (heldItem)
        observer.observe(heldItem, {
          attributes: true,
          attributeFilter: ["data-item-state"],
        });
      appearance(event.target);
    };
    const up = (event: PointerEvent) => {
      if (!mouse(event)) return;
      const released = pressed;
      pressed = false;
      heldItem = null;
      observer.disconnect();
      appearance(document.elementFromPoint(event.clientX, event.clientY));
      if (released && visible && !reduced) {
        rippleScale.stop();
        rippleOpacity.stop();
        rippleScale.set(0.8);
        rippleOpacity.set(0.45);
        void animate(rippleScale, 2.2, { duration: 0.38, ease: "easeOut" });
        void animate(rippleOpacity, 0, { duration: 0.38, ease: "easeOut" });
      }
    };
    const cancel = () => {
      pressed = false;
      heldItem = null;
      observer.disconnect();
      appearance(document.elementFromPoint(pointer.x, pointer.y));
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") cancel();
    };
    const leave = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };
    const scroll = () => {
      if (visible) appearance(document.elementFromPoint(pointer.x, pointer.y));
    };
    const raise = (event: Event) => {
      if (
        !visible ||
        event.target === layer ||
        !(event.target instanceof HTMLElement)
      )
        return;
      if (
        !(event.target instanceof HTMLDialogElement) &&
        !event.target.hasAttribute("popover")
      )
        return;
      layer.hidePopover();
      show();
    };
    const motionPreference = () => {
      reduced = preference.matches;
      rippleScale.stop();
      rippleOpacity.stop();
      rippleOpacity.set(0);
      setMode(mode, true);
    };
    preference.addEventListener("change", motionPreference);
    document.addEventListener("pointermove", move, {
      passive: true,
      capture: true,
    });
    document.addEventListener("pointerdown", down, {
      passive: true,
      capture: true,
    });
    document.addEventListener("pointerup", up, {
      passive: true,
      capture: true,
    });
    document.addEventListener("pointercancel", cancel, true);
    document.addEventListener("pointerout", leave, {
      passive: true,
      capture: true,
    });
    document.addEventListener("keydown", escape);
    document.addEventListener("toggle", raise, true);
    window.addEventListener("scroll", scroll, { passive: true, capture: true });
    window.addEventListener("blur", hide);
    return () => {
      preference.removeEventListener("change", motionPreference);
      hide();
      scale.stop();
      rotate.stop();
      document.documentElement.removeAttribute("data-ring-cursor");
      document.removeEventListener("pointermove", move, true);
      document.removeEventListener("pointerdown", down, true);
      document.removeEventListener("pointerup", up, true);
      document.removeEventListener("pointercancel", cancel, true);
      document.removeEventListener("pointerout", leave, true);
      document.removeEventListener("keydown", escape);
      document.removeEventListener("toggle", raise, true);
      window.removeEventListener("scroll", scroll, true);
      window.removeEventListener("blur", hide);
    };
  }, [ref, x, y, scale, rotate, rippleScale, rippleOpacity]);
  return { x, y, scale, rotate, rippleScale, rippleOpacity };
}
