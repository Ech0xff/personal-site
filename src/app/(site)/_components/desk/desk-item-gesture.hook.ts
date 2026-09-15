import {
  animate,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { deskItemDefinitions } from "#lib/shared/desk/desk-item.schema";
import {
  findPosition,
  type Box,
  type PlacedItem,
} from "#lib/shared/desk/desk-layout.helper";

type Phase = "idle" | "pressing" | "dragging" | "resizing" | "settling";
type Options = Readonly<{
  entry: PlacedItem;
  obstacles: readonly Box[];
  canvasWidth: number;
  canvasHeight?: number;
  canvasScale: number;
  disabled: boolean;
  commit: (box: Box, scale: number) => Promise<boolean>;
  preview: (box: Box | null) => void;
}>;
export function useDeskItemGesture({
  entry,
  obstacles,
  canvasWidth,
  canvasHeight,
  canvasScale,
  disabled,
  commit,
  preview,
}: Options) {
  const definition = deskItemDefinitions[entry.item.type];
  const controls = useDragControls();
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(entry.scale);
  const [phase, setPhase] = useState<Phase>("idle");
  const phaseRef = useRef<Phase>("idle");
  const pending = useRef<{
    timer: ReturnType<typeof setTimeout>;
    x: number;
    y: number;
  } | null>(null);
  const suppressClick = useRef(false);
  const candidate = useRef({ box: entry.box, scale: entry.scale });
  const resizeCleanup = useRef<(() => void) | null>(null);
  const changePhase = (next: Phase) => {
    phaseRef.current = next;
    setPhase(next);
  };
  const clearPress = () => {
    if (pending.current) clearTimeout(pending.current.timer);
    pending.current = null;
  };
  useEffect(
    () => () => {
      phaseRef.current = "idle";
      x.stop();
      y.stop();
      scale.stop();
    },
    [x, y, scale],
  );
  const cancel = () => {
    clearPress();
    controls.cancel();
    resizeCleanup.current?.();
    resizeCleanup.current = null;
    x.stop();
    y.stop();
    scale.stop();
    x.set(0);
    y.set(0);
    scale.set(entry.scale);
    preview(null);
    changePhase("idle");
  };
  const finish = async () => {
    const result = candidate.current;
    changePhase("settling");
    const transition = { duration: reducedMotion ? 0 : 0.18 };
    await Promise.all([
      animate(x, result.box.x - entry.box.x, transition),
      animate(y, result.box.y - entry.box.y, transition),
      animate(scale, result.scale, transition),
    ]);
    if (phaseRef.current !== "settling") return;
    const saved = await commit(result.box, result.scale);
    preview(null);
    changePhase("idle");
    x.set(0);
    y.set(0);
    scale.set(saved ? result.scale : entry.scale);
    setTimeout(() => {
      suppressClick.current = false;
    }, 0);
  };
  useEffect(() => {
    if (phaseRef.current === "idle") scale.set(entry.scale);
  }, [entry.scale, scale]);
  const cancelGesture = useEffectEvent(cancel);
  useEffect(() => {
    if (phase === "idle") return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") cancelGesture();
    };
    const release = () => {
      if (phaseRef.current === "pressing") cancelGesture();
      // Motion may not emit drag-end when a hold is released before its first move frame.
      else if (phaseRef.current === "dragging")
        requestAnimationFrame(() => {
          if (phaseRef.current === "dragging") cancelGesture();
        });
    };
    const blur = () => cancelGesture();
    const touchMove = (event: TouchEvent) => {
      if (phaseRef.current === "dragging") event.preventDefault();
    };
    window.addEventListener("touchmove", touchMove, { passive: false });
    window.addEventListener("keydown", escape);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", blur);
    window.addEventListener("blur", blur);
    return () => {
      clearPress();
      resizeCleanup.current?.();
      window.removeEventListener("touchmove", touchMove);
      window.removeEventListener("keydown", escape);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", blur);
      window.removeEventListener("blur", blur);
    };
  }, [phase]);
  const press = (event: ReactPointerEvent<HTMLElement>) => {
    if (
      disabled ||
      phaseRef.current !== "idle" ||
      !entry.item.appearance.draggable ||
      event.button !== 0 ||
      !event.isPrimary
    )
      return;
    suppressClick.current = false;
    const target = event.target;
    if (!(target instanceof Element)) return;
    // Only controls inside this item block dragging; the desk can itself scroll.
    for (
      let element: Element | null = target;
      element && element !== event.currentTarget;
      element = element.parentElement
    ) {
      if (
        element.matches(
          "input, textarea, select, [contenteditable=true], [role=slider], [data-item-resize], [data-item-edit], [data-lenis-prevent]",
        ) ||
        (element.scrollHeight > element.clientHeight &&
          /auto|scroll/.test(getComputedStyle(element).overflowY))
      )
        return;
    }
    clearPress();
    const native = event.nativeEvent;
    changePhase("pressing");
    pending.current = {
      x: event.clientX,
      y: event.clientY,
      timer: setTimeout(() => {
        pending.current = null;
        suppressClick.current = true;
        candidate.current = { box: entry.box, scale: entry.scale };
        changePhase("dragging");
        preview(entry.box);
        controls.start(native, { distanceThreshold: 0 });
      }, 350),
    };
  };
  const move = (event: ReactPointerEvent<HTMLElement>) => {
    if (
      pending.current &&
      Math.hypot(
        event.clientX - pending.current.x,
        event.clientY - pending.current.y,
      ) > 8
    )
      cancel();
  };
  const drag = (
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const box =
      findPosition(
        {
          ...entry.box,
          x: entry.box.x + info.offset.x,
          y: entry.box.y + info.offset.y,
        },
        obstacles,
        canvasWidth,
        canvasHeight,
      ) ?? entry.box;
    candidate.current = { box, scale: entry.scale };
    preview(box);
  };
  const resize = (event: ReactPointerEvent<HTMLElement>, corner: string) => {
    if (
      disabled ||
      phaseRef.current !== "idle" ||
      !definition.capabilities.resizable
    )
      return;
    event.preventDefault();
    event.stopPropagation();
    clearPress();
    changePhase("resizing");
    suppressClick.current = true;
    const startX = event.clientX;
    const startY = event.clientY;
    const west = corner.includes("w");
    const north = corner.includes("n");
    candidate.current = { box: entry.box, scale: entry.scale };
    const update = (pointer: PointerEvent) => {
      if (pointer.pointerId !== event.pointerId) return;
      const dx = ((pointer.clientX - startX) / canvasScale) * (west ? -1 : 1);
      const dy = ((pointer.clientY - startY) / canvasScale) * (north ? -1 : 1);
      const nextScale = Math.min(
        entry.item.appearance.maxScale,
        (canvasWidth - entry.padding * 2) / entry.width,
        Math.max(
          entry.item.appearance.minScale,
          entry.scale +
            (dx * entry.width + dy * entry.height) /
              (entry.width ** 2 + entry.height ** 2),
        ),
      );
      const width = entry.width * nextScale + entry.padding * 2;
      const height = entry.height * nextScale + entry.padding * 2;
      const target = {
        width,
        height,
        x: entry.box.x + (west ? entry.box.width - width : 0),
        y: entry.box.y + (north ? entry.box.height - height : 0),
      };
      const box = findPosition(target, obstacles, canvasWidth, canvasHeight);
      if (!box) return;
      candidate.current = { box, scale: nextScale };
      scale.set(nextScale);
      x.set(target.x - entry.box.x);
      y.set(target.y - entry.box.y);
      preview(box);
    };
    const end = (pointer: PointerEvent) => {
      if (pointer.pointerId !== event.pointerId) return;
      resizeCleanup.current?.();
      resizeCleanup.current = null;
      void finish();
    };
    window.addEventListener("pointermove", update);
    window.addEventListener("pointerup", end);
    resizeCleanup.current = () => {
      window.removeEventListener("pointermove", update);
      window.removeEventListener("pointerup", end);
    };
  };
  return {
    phase,
    controls,
    x,
    y,
    scale,
    press,
    move,
    drag,
    finish,
    cancel,
    resize,
    suppressClick,
  };
}
