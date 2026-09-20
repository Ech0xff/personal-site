"use client";
import * as stylex from "@stylexjs/stylex";
import { MotionConfig } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";

import { lampOff } from "#design/tokens.stylex";
import { personalDeskLayoutsAtom } from "#lib/client/desk/desk-layout.atom";
import type { AudioAsset } from "#lib/shared/audio/audio.schema";
import {
  layoutDesk,
  deskCanvasScale,
  savePlacement,
  replaceDeskItem,
  shuffleDesk,
  type Box,
  type Size,
} from "#lib/shared/desk/desk-layout.helper";
import type {
  DeskBreakpoint,
  DeskPlacement,
  DeskConfiguration,
} from "#lib/shared/desk/desk-layout.schema";

import { DisplaySettings } from "../display/display-settings.component";
import { DeskEditorToolbar } from "./desk-editor-toolbar.component";
import { useDeskEditor } from "./desk-editor.hook";
import { DeskItemFrame } from "./desk-item.component";
import { renderDeskItem } from "./desk-item.registry";
import { itemStyles } from "./desk-item.style";
import { useDeskViewport } from "./desk-viewport.hook";
import { ItemEditor } from "./item-editor.component";
import { lampOnAtom } from "./lamp.atom";
import { desk } from "./reading-desk.style";

export function ReadingDesk({
  items,
  layouts,
  programs,
  audioAssets,
}: Readonly<
  DeskConfiguration & {
    audioAssets: readonly AudioAsset[];
    programs: Readonly<{ stats: ReactNode; guestbook: ReactNode }>;
  }
>) {
  const root = useRef<HTMLDivElement>(null);
  const landing = useRef<HTMLDivElement>(null);
  const [lampOn, setLampOn] = useAtom(lampOnAtom);
  const setPersonal = useSetAtom(personalDeskLayoutsAtom);
  const [measured, setMeasured] = useState<Record<string, Size>>({});
  const editTrigger = useRef<HTMLButtonElement | null>(null);
  const [editingTarget, setEditingTarget] = useState<{
    id: string;
    breakpoint: DeskBreakpoint;
    placement: DeskPlacement;
  } | null>(null);
  const editingItemId = editingTarget?.id ?? null;
  const [selected, setSelected] = useState<string | null>(null);
  const initial = useMemo(() => ({ items, layouts }), [items, layouts]);
  const editor = useDeskEditor(initial, audioAssets);
  const { viewport, breakpoint, available } = useDeskViewport(root);
  const editingItem = editor.configuration.items.find(
    (item) => item.id === editingItemId,
  );
  const layout = editor.configuration.layouts[breakpoint];
  const entries = layoutDesk(
    editor.configuration.items,
    layout,
    viewport,
    measured,
    editor.personalLayouts?.[breakpoint],
  );
  const height = Math.max(
    viewport.height,
    ...entries.map(
      (entry) =>
        entry.box.y + entry.box.height + (breakpoint === "desktop" ? 0 : 48),
    ),
  );
  const canvasScale =
    breakpoint === "desktop"
      ? deskCanvasScale({ width: viewport.width, height }, available)
      : 1;
  const measure = useCallback(
    (id: string, size: Size) =>
      setMeasured((previous) =>
        previous[id]?.height === size.height &&
        previous[id]?.width === size.width
          ? previous
          : { ...previous, [id]: size },
      ),
    [],
  );
  const preview = useCallback((box: Box | null) => {
    const node = landing.current;
    if (!node) return;
    node.hidden = box === null;
    if (box) {
      node.style.transform = `translate(${box.x}px, ${box.y}px)`;
      node.style.width = `${box.width}px`;
      node.style.height = `${box.height}px`;
    }
  }, []);
  const commit = async (id: string, box: Box, scale: number) => {
    if (editor.editing) {
      return editor.change({
        ...editor.configuration,
        layouts: {
          ...editor.configuration.layouts,
          [breakpoint]: {
            ...layout,
            placements: {
              ...layout.placements,
              ...Object.fromEntries(
                entries
                  .filter((entry) => entry.item.appearance.draggable)
                  .map((entry) => [
                    entry.item.id,
                    savePlacement(entry.box, entry.scale, viewport, layout),
                  ]),
              ),
              [id]: savePlacement(box, scale, viewport, layout),
            },
          },
        },
      });
    } else {
      setPersonal((previous) => {
        const current = previous[breakpoint];
        const positions = Object.fromEntries(
          Object.entries(current?.positions ?? {}).map(([key, point]) => [
            key,
            {
              x:
                (point.x * viewport.width) / (current?.width ?? viewport.width),
              y:
                (point.y * viewport.height) /
                (current?.height ?? viewport.height),
            },
          ]),
        );
        return {
          ...previous,
          [breakpoint]: {
            ...viewport,
            positions: { ...positions, [id]: { x: box.x, y: box.y } },
          },
        };
      });
      return true;
    }
  };
  const shuffle = () => {
    if (editor.busy || editor.preview) return;
    const shuffled = shuffleDesk(
      entries,
      viewport,
      Math.floor(Math.random() * 4294967296),
    );
    if (shuffled === entries) return;
    if (editor.editing) {
      void editor.change({
        ...editor.configuration,
        layouts: {
          ...editor.configuration.layouts,
          [breakpoint]: {
            ...layout,
            placements: {
              ...layout.placements,
              ...Object.fromEntries(
                shuffled
                  .filter((entry) => entry.item.appearance.draggable)
                  .map((entry) => [
                    entry.item.id,
                    savePlacement(entry.box, entry.scale, viewport, layout),
                  ]),
              ),
            },
          },
        },
      });
    } else {
      setPersonal((previous) => ({
        ...previous,
        [breakpoint]: {
          ...viewport,
          positions: Object.fromEntries(
            shuffled
              .filter((entry) => entry.item.appearance.draggable)
              .map((entry) => [
                entry.item.id,
                { x: entry.box.x, y: entry.box.y },
              ]),
          ),
        },
      }));
    }
  };
  return (
    <div ref={root} {...stylex.props(desk.scene, !lampOn && lampOff)}>
      {editor.editing && editingItem && editingTarget && (
        <ItemEditor
          key={editingItem.id}
          item={editingItem}
          busy={editor.busy}
          notice={editor.notice}
          breakpoint={editingTarget.breakpoint}
          scale={
            Object.hasOwn(
              editor.configuration.layouts[editingTarget.breakpoint].placements,
              editingItem.id,
            )
              ? editor.configuration.layouts[editingTarget.breakpoint]
                  .placements[editingItem.id].scale
              : 1
          }
          assets={editor.audioAssets}
          onAssets={editor.setAudioAssets}
          close={() => {
            setEditingTarget(null);
            requestAnimationFrame(() => editTrigger.current?.focus());
          }}
          apply={(item, scale) =>
            editor.change(
              replaceDeskItem(
                editor.configuration,
                item,
                editingTarget.breakpoint,
                scale,
                editingItem.appearance.draggable && !item.appearance.draggable
                  ? editingTarget.placement
                  : undefined,
              ),
            )
          }
        />
      )}
      {editor.editing && (
        <DeskEditorToolbar
          editor={editor}
          reset={() => editor.reset(breakpoint)}
          shuffle={shuffle}
        />
      )}
      <div
        data-lenis-prevent={breakpoint === "desktop" ? true : undefined}
        {...stylex.props(
          desk.viewport,
          breakpoint === "desktop" && desk.fixedViewport,
        )}
        style={{
          height: breakpoint === "desktop" ? available.height : height,
        }}
      >
        <div
          {...stylex.props(desk.scaledCanvas)}
          style={{ height: height * canvasScale }}
        >
          <MotionConfig
            transformPagePoint={(point) => ({
              x: point.x / canvasScale,
              y: point.y / canvasScale,
            })}
          >
            <div
              {...stylex.props(desk.frame)}
              style={{
                position: "absolute",
                width: viewport.width,
                left: (available.width - viewport.width * canvasScale) / 2,
                transform: `scale(${canvasScale})`,
              }}
            >
              <div
                {...stylex.props(desk.canvas)}
                style={{ height }}
                data-desk-canvas
                data-desk-breakpoint={breakpoint}
                data-desk-editing={editor.editing}
              >
                <div {...stylex.props(desk.glow)} aria-hidden="true" />
                <div
                  ref={landing}
                  hidden
                  {...stylex.props(itemStyles.landing)}
                />
                {entries.map((entry) => (
                  <DeskItemFrame
                    key={entry.item.id}
                    entry={entry}
                    obstacles={entries
                      .filter((other) => other.item.id !== entry.item.id)
                      .map((other) => other.box)}
                    canvasWidth={viewport.width}
                    canvasHeight={
                      breakpoint === "desktop" ? viewport.height : undefined
                    }
                    canvasScale={canvasScale}
                    editing={editor.editing && !editor.preview}
                    busy={editor.busy || editingItemId !== null}
                    edit={(trigger) => {
                      editTrigger.current = trigger;
                      setSelected(entry.item.id);
                      setEditingTarget({
                        id: entry.item.id,
                        breakpoint,
                        placement: savePlacement(
                          entry.box,
                          entry.scale,
                          viewport,
                          layout,
                        ),
                      });
                    }}
                    selected={selected === entry.item.id}
                    select={() => setSelected(entry.item.id)}
                    commit={(box, scale) => commit(entry.item.id, box, scale)}
                    preview={preview}
                    measure={measure}
                  >
                    {renderDeskItem(entry.item, {
                      ...programs,
                      audioAssets: editor.audioAssets,
                      settings: (
                        <DisplaySettings
                          reset={() => setPersonal({})}
                          shuffle={shuffle}
                          enter={editor.enter}
                          busy={editor.busy}
                          notice={editor.notice}
                        />
                      ),
                      lampOn,
                      toggleLamp: () => setLampOn((on) => !on),
                    })}
                  </DeskItemFrame>
                ))}
              </div>
            </div>
          </MotionConfig>
        </div>
      </div>
    </div>
  );
}
