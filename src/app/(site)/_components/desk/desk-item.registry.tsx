import type { ReactNode } from "react";

import { resolveTracks, type AudioAsset } from "#lib/shared/audio/audio.schema";
import type { DeskItem } from "#lib/shared/desk/desk-item.schema";

import { DisplayTerminal } from "../display/display-terminal.component";
import { RetroComputer } from "../display/retro-computer.component";
import {
  RecordPlayer,
  RecordPlayerPreview,
} from "../record-player/record-player.component";
import { BookStack } from "./book-stack.component";
import { Coffee } from "./coffee.component";
import { DeskLamp } from "./desk-lamp.component";
import { Intro } from "./intro.component";
import { Letter } from "./letter.component";
import { Pencil } from "./pencil.component";

type DeskServices = Readonly<{
  audioAssets: readonly AudioAsset[];
  stats: ReactNode;
  guestbook: ReactNode;
  settings: ReactNode;
  lampOn: boolean;
  toggleLamp: () => void;
  preview?: boolean;
}>;
/** Each branch preserves the concrete relationship between the item and its props. */
export function renderDeskItem(
  item: DeskItem,
  services: DeskServices,
): ReactNode {
  switch (item.type) {
    case "display":
      return (
        <RetroComputer
          name={item.name}
          preview={services.preview}
          programs={{
            terminal: <DisplayTerminal lines={item.config.terminalLines} />,
            stats: services.stats,
            guestbook: services.guestbook,
            settings: services.settings,
          }}
        />
      );
    case "intro":
      return <Intro config={item.config} />;
    case "lamp":
      return (
        <DeskLamp
          on={services.lampOn}
          toggle={services.toggleLamp}
          preview={services.preview}
        />
      );
    case "record": {
      const Player = services.preview ? RecordPlayerPreview : RecordPlayer;
      return (
        <Player
          name={item.name}
          tracks={resolveTracks(item.config.tracks, services.audioAssets)}
        />
      );
    }
    case "books":
      return <BookStack name={item.name} config={item.config} />;
    case "letter":
      return <Letter name={item.name} config={item.config} />;
    case "coffee":
      return <Coffee name={item.name} />;
    case "pencil":
      return <Pencil name={item.name} />;
  }
}
