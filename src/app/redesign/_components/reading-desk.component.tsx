"use client";
import * as stylex from "@stylexjs/stylex";
import { useAtom } from "jotai";

import { profile } from "./desk-content.const";
import { DeskLamp } from "./desk-lamp.component";
import { BookStack, Calendar, Coffee, Letter } from "./desk-objects.component";
import { lampOnAtom } from "./desk-preferences.atom";
import { desk, lampOff } from "./reading-desk.style";
import { RecordPlayer } from "./record-player.component";
import { RetroComputer } from "./retro-computer.component";
import { SocialLinks } from "./social-links.component";
export function ReadingDesk() {
  const [lampOn, setLampOn] = useAtom(lampOnAtom);
  return (
    <div {...stylex.props(desk.scene, !lampOn && lampOff)}>
      <div {...stylex.props(desk.glow)} aria-hidden="true" />
      <DeskLamp on={lampOn} toggle={() => setLampOn((value) => !value)} />
      <section {...stylex.props(desk.intro)}>
        <p {...stylex.props(desk.eyebrow)}>
          <span {...stylex.props(desk.wave)} aria-hidden="true">
            👋
          </span>
          {profile.greeting}
        </p>
        <h1 tabIndex={-1} {...stylex.props(desk.title)}>
          I’m <span {...stylex.props(desk.name)}>{profile.name}.</span>
        </h1>
        <p {...stylex.props(desk.role)}>{profile.role}</p>
        <p {...stylex.props(desk.body)}>{profile.introduction}</p>
        <SocialLinks />
      </section>
      <div {...stylex.props(desk.objects)}>
        <div id="desk-objects" {...stylex.props(desk.slot, desk.computer)}>
          <RetroComputer />
        </div>
        <div {...stylex.props(desk.slot, desk.record)}>
          <RecordPlayer />
        </div>
        <div {...stylex.props(desk.slot, desk.books)}>
          <BookStack />
        </div>
        <div {...stylex.props(desk.slot, desk.letter)}>
          <Letter />
        </div>
        <div {...stylex.props(desk.slot, desk.calendar)}>
          <Calendar />
        </div>
        <div {...stylex.props(desk.slot, desk.coffee)}>
          <Coffee />
        </div>
        <span {...stylex.props(desk.pencil)} aria-hidden="true">
          <i {...stylex.props(desk.pencilTip)} />
        </span>
      </div>
    </div>
  );
}
