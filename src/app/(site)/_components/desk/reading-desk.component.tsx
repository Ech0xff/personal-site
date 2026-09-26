"use client";
import * as stylex from "@stylexjs/stylex";
import { useAtom } from "jotai";
import type { ReactNode } from "react";

import { lampOff } from "#design/tokens.stylex";
import type { AudioAsset } from "#lib/shared/audio/audio.schema";
import type {
  DeskConfiguration,
  DeskItemType,
} from "#lib/shared/desk/desk-configuration.schema";

import { DeskItemFrame } from "./desk-item.component";
import { renderDeskItem } from "./desk-item.registry";
import { lampOnAtom } from "./lamp.atom";
import { desk } from "./reading-desk.style";

const readingOrder = [
  "intro",
  "books",
  "letter",
  "display",
  "record",
  "lamp",
  "coffee",
  "pencil",
] as const satisfies readonly DeskItemType[];

export function ReadingDesk({
  items,
  programs,
  audioAssets,
}: Readonly<
  DeskConfiguration & {
    audioAssets: readonly AudioAsset[];
    programs: Readonly<{ stats: ReactNode; guestbook: ReactNode }>;
  }
>) {
  const [lampOn, setLampOn] = useAtom(lampOnAtom);
  const orderedItems = readingOrder.flatMap((type) =>
    items.filter((item) => item.type === type),
  );
  return (
    <div {...stylex.props(desk.scene, !lampOn && lampOff)}>
      <div {...stylex.props(desk.glow)} aria-hidden="true" />
      <div {...stylex.props(desk.grid)} data-desk-scene>
        {orderedItems.map((item) => (
          <DeskItemFrame key={item.id} item={item}>
            {renderDeskItem(item, {
              ...programs,
              audioAssets,
              lampOn,
              toggleLamp: () => setLampOn((on) => !on),
            })}
          </DeskItemFrame>
        ))}
      </div>
    </div>
  );
}
