import * as stylex from "@stylexjs/stylex";
import { motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";

import { deskItemDefinitions } from "#lib/shared/desk/desk-item.schema";
import type {
  Box,
  PlacedItem,
  Size,
} from "#lib/shared/desk/desk-layout.helper";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { useDeskItemGesture } from "./desk-item-gesture.hook";
import { DeskItemContext } from "./desk-item.context";
import { itemStyles as styles } from "./desk-item.style";

type Props = Readonly<{
  entry: PlacedItem;
  obstacles: readonly Box[];
  canvasWidth: number;
  canvasHeight?: number;
  canvasScale: number;
  editing: boolean;
  busy: boolean;
  selected: boolean;
  select: () => void;
  commit: (box: Box, scale: number) => void;
  preview: (box: Box | null) => void;
  measure: (id: string, size: Size) => void;
  children: ReactNode;
}>;
export function DeskItemFrame({
  entry,
  obstacles,
  canvasWidth,
  canvasHeight,
  canvasScale,
  editing,
  busy,
  selected,
  select,
  commit,
  preview,
  measure,
  children,
}: Props) {
  const content = useRef<HTMLDivElement>(null);
  const definition = deskItemDefinitions[entry.item.type];
  const gesture = useDeskItemGesture({
    entry,
    obstacles,
    canvasWidth,
    canvasHeight,
    canvasScale,
    disabled: busy,
    commit,
    preview,
  });
  useEffect(() => {
    const element = content.current;
    if (!element) return;
    const update = () =>
      measure(entry.item.id, {
        width: element.offsetWidth,
        height: element.offsetHeight,
      });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => observer.disconnect();
  }, [measure, entry.item.id]);
  const active =
    gesture.phase === "dragging" ||
    gesture.phase === "resizing" ||
    gesture.phase === "settling";
  return (
    <motion.div
      data-desk-item={entry.item.id}
      data-item-state={gesture.phase}
      data-item-draggable={definition.capabilities.draggable}
      {...stylex.props(styles.root, active && styles.active)}
      style={{
        left: entry.box.x,
        top: entry.box.y,
        width: entry.box.width,
        height: entry.box.height,
        x: gesture.x,
        y: gesture.y,
      }}
      drag={definition.capabilities.draggable}
      dragListener={false}
      dragControls={gesture.controls}
      dragMomentum={false}
      onDragStartCapture={(event) => {
        if (definition.capabilities.draggable) event.preventDefault();
      }}
      onDrag={gesture.drag}
      onDragEnd={gesture.finish}
      onPointerDownCapture={gesture.press}
      onPointerMoveCapture={gesture.move}
      onContextMenu={(event) => {
        if (gesture.phase !== "idle") event.preventDefault();
      }}
      onClickCapture={(event) => {
        const target = event.target;
        if (target instanceof Element && target.closest("[data-item-resize]"))
          return;
        if (
          gesture.suppressClick.current ||
          editing ||
          (target instanceof Element &&
            target.closest("[data-item-drag-handle]"))
        ) {
          event.preventDefault();
          event.stopPropagation();
          if (editing) select();
        }
      }}
    >
      <motion.div style={{ padding: entry.padding }}>
        <motion.div
          ref={content}
          inert={editing}
          {...stylex.props(styles.content)}
          style={{ width: entry.width, scale: gesture.scale }}
        >
          <DeskItemContext
            value={{
              draggable: definition.capabilities.draggable,
              editing,
              emphasized:
                active || gesture.phase === "pressing" || (editing && selected),
            }}
          >
            {children}
          </DeskItemContext>
        </motion.div>
      </motion.div>
      {editing && (
        <span
          aria-hidden
          data-item-editor-frame
          {...stylex.props(
            styles.editorFrame,
            selected && styles.selectedFrame,
          )}
        />
      )}
      {definition.capabilities.draggable && editing && (
        <button
          type="button"
          data-item-drag-handle
          aria-label={`${defaultDictionary.desk.layout.move} ${entry.item.name}`}
          title={`${defaultDictionary.desk.layout.holdToMove} ${entry.item.name}`}
          onClick={select}
          {...stylex.props(styles.handle, styles.handleVisible)}
        >
          {entry.item.name}
        </button>
      )}
      {editing &&
        selected &&
        definition.capabilities.resizable &&
        ["nw", "ne", "sw", "se"].map((corner) => (
          <button
            key={corner}
            type="button"
            data-item-resize
            aria-label={`${defaultDictionary.desk.layout.resize} ${entry.item.name} ${corner}`}
            onPointerDown={(event) => gesture.resize(event, corner)}
            {...stylex.props(styles.resize)}
            style={{
              left: corner.includes("w") ? -8 : undefined,
              right: corner.includes("e") ? -8 : undefined,
              top: corner.includes("n") ? -8 : undefined,
              bottom: corner.includes("s") ? -8 : undefined,
            }}
          />
        ))}
    </motion.div>
  );
}
