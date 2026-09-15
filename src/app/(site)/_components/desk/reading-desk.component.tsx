"use client";
import * as stylex from "@stylexjs/stylex";
import { MotionConfig } from "framer-motion";
import { useAtom } from "jotai";
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";

import { lampOff } from "#design/tokens.stylex";
import { deskItemDefinitions } from "#lib/shared/desk/desk-item.schema";
import {
  layoutDesk,
  savePlacement,
  shuffleDesk,
  type Box,
  type Size,
} from "#lib/shared/desk/desk-layout.helper";
import type { DeskConfiguration } from "#lib/shared/desk/desk-layout.schema";

import { DisplaySettings } from "../display/display-settings.component";
import { DeskEditorToolbar } from "./desk-editor-toolbar.component";
import { useDeskEditor } from "./desk-editor.hook";
import { DeskItemFrame } from "./desk-item.component";
import { renderDeskItem } from "./desk-item.registry";
import { itemStyles } from "./desk-item.style";
import { personalDeskLayoutsAtom } from "./desk-layout.atom";
import { useDeskViewport } from "./desk-viewport.hook";
import { lampOnAtom } from "./lamp.atom";
import { desk } from "./reading-desk.style";

export function ReadingDesk({
  items,
  layouts,
  programs,
}: Readonly<
  DeskConfiguration & {
    programs: Readonly<{ stats: ReactNode; guestbook: ReactNode }>;
  }
>) {
  const root = useRef<HTMLDivElement>(null);
  const landing = useRef<HTMLDivElement>(null);
  const [lampOn, setLampOn] = useAtom(lampOnAtom);
  const [personal, setPersonal] = useAtom(personalDeskLayoutsAtom);
  const [measured, setMeasured] = useState<Record<string, Size>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const initial = useMemo(() => ({ items, layouts }), [items, layouts]);
  const editor = useDeskEditor(initial);
  const { viewport, breakpoint, available } = useDeskViewport(root);
  const layout = editor.configuration.layouts[breakpoint];
  const entries = layoutDesk(
    editor.configuration.items,
    layout,
    viewport,
    measured,
    editor.editing ? undefined : personal[breakpoint],
  );
  const height = Math.max(
    viewport.height,
    ...entries.map((entry) => entry.box.y + entry.box.height + 48),
  );
  const canvasScale =
    breakpoint === "desktop"
      ? Math.min(1, available.width / viewport.width, available.height / height)
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
  const commit = (id: string, box: Box, scale: number) => {
    if (editor.editing) {
      editor.change({
        ...editor.configuration,
        layouts: {
          ...editor.configuration.layouts,
          [breakpoint]: {
            ...layout,
            placements: {
              ...Object.fromEntries(
                entries.map((entry) => [
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
      editor.change({
        ...editor.configuration,
        layouts: {
          ...editor.configuration.layouts,
          [breakpoint]: {
            ...layout,
            placements: Object.fromEntries(
              shuffled.map((entry) => [
                entry.item.id,
                savePlacement(entry.box, entry.scale, viewport, layout),
              ]),
            ),
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
              .filter(
                (entry) =>
                  deskItemDefinitions[entry.item.type].capabilities.draggable,
              )
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
      {editor.editing && (
        <DeskEditorToolbar
          editor={editor}
          reset={() => editor.reset(breakpoint)}
          shuffle={shuffle}
        />
      )}
      <div
        style={{ height: breakpoint === "desktop" ? available.height : height }}
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
              <div ref={landing} hidden {...stylex.props(itemStyles.landing)} />
              {entries.map((entry) => (
                <DeskItemFrame
                  key={entry.item.id}
                  entry={entry}
                  obstacles={entries
                    .filter((other) => other.item.id !== entry.item.id)
                    .map((other) => other.box)}
                  canvasWidth={viewport.width}
                  canvasHeight={
                    breakpoint === "desktop" ? height - 48 : undefined
                  }
                  canvasScale={canvasScale}
                  editing={editor.editing && !editor.preview}
                  busy={editor.busy}
                  selected={selected === entry.item.id}
                  select={() => setSelected(entry.item.id)}
                  commit={(box, scale) => commit(entry.item.id, box, scale)}
                  preview={preview}
                  measure={measure}
                >
                  {renderDeskItem(entry.item, {
                    ...programs,
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
  );
}
