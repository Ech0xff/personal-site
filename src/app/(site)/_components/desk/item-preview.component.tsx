import * as stylex from "@stylexjs/stylex";
import { useEffect, useRef, useState } from "react";

import type { AudioAsset } from "#lib/shared/audio/audio.schema";
import {
  deskItemDefinitions,
  type DeskItem,
} from "#lib/shared/desk/desk-item.schema";

import {
  objectMarker,
  recordMarker,
} from "../../_design/object-feedback.stylex";
import { DeskItemContext } from "./desk-item.context";
import { renderDeskItem } from "./desk-item.registry";
import { itemStyles } from "./desk-item.style";
import { editorStyles as styles } from "./item-editor.style";

export function ItemPreview({
  item,
  scale,
  assets,
}: Readonly<{
  item: DeskItem;
  scale: number;
  assets: readonly AudioAsset[];
}>) {
  const definition = deskItemDefinitions[item.type];
  const width = definition.width;
  const stage = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{
    width: number;
    height: number;
    contentHeight: number;
  }>({
    width: 400,
    height: 480,
    contentHeight: definition.height,
  });
  useEffect(() => {
    const area = stage.current;
    const object = content.current;
    if (!area || !object) return;
    const update = () =>
      setSize({
        width: area.clientWidth,
        height: area.clientHeight,
        contentHeight: object.offsetHeight || definition.height,
      });
    const observer = new ResizeObserver(update);
    observer.observe(area);
    observer.observe(object);
    update();
    return () => observer.disconnect();
  }, [definition.height]);
  const fit = Math.max(
    0.1,
    Math.min(
      1,
      (size.width - 80) / Math.max(width, 300),
      (size.height - 112) / Math.max(size.contentHeight, 260),
    ),
  );
  const appearance = item.appearance;
  const currentScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
  const base = `translate(${appearance.offsetX}px, ${appearance.offsetY}px) rotate(${appearance.rotation}deg)`;
  const hover = `translate(${appearance.hoverX}px, ${appearance.hoverY}px) rotate(${appearance.hoverRotation}deg) scale(${appearance.hoverScale / currentScale})`;
  return (
    <aside aria-label="Item preview" {...stylex.props(styles.preview)}>
      <p {...stylex.props(styles.previewLabel)}>Preview</p>
      <div ref={stage} {...stylex.props(styles.previewStage)}>
        <div style={{ width: width * fit, height: size.contentHeight * fit }}>
          <div
            {...stylex.props(styles.previewCanvas)}
            style={{ transform: `scale(${fit})` }}
          >
            <div
              style={{
                width,
                height: size.contentHeight,
                transform: `scale(${currentScale})`,
              }}
            >
              <div
                data-item-preview
                {...stylex.props(
                  itemStyles.appearance(base, hover),
                  objectMarker,
                  recordMarker,
                )}
              >
                <div
                  ref={content}
                  inert
                  style={{
                    minHeight:
                      item.type === "lamp" ? definition.height : undefined,
                  }}
                >
                  <DeskItemContext
                    value={{
                      editing: true,
                      draggable: false,
                      emphasized: false,
                    }}
                  >
                    {renderDeskItem(item, {
                      audioAssets: assets,
                      stats: null,
                      guestbook: null,
                      settings: null,
                      lampOn: true,
                      toggleLamp: () => {},
                      preview: true,
                    })}
                  </DeskItemContext>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
