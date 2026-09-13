"use client";
import * as stylex from "@stylexjs/stylex";
import { useAtom } from "jotai";
import type { ReactNode } from "react";

import { lampOff } from "#design/tokens.stylex";

import type { DisplayProgram } from "../display/display-content.schema";
import { RetroComputer } from "../display/retro-computer.component";
import { RecordPlayer } from "../record-player/record-player.component";
import { BookStack } from "./book-stack.component";
import { Calendar } from "./calendar.component";
import { Coffee } from "./coffee.component";
import { DeskLamp } from "./desk-lamp.component";
import { lampOnAtom } from "./lamp.atom";
import { Letter } from "./letter.component";
import { profile } from "./profile.const";
import { desk } from "./reading-desk.style";
import { SocialLinks } from "./social-links.component";
export function ReadingDesk({
  programs,
}: Readonly<{ programs: Readonly<Record<DisplayProgram, ReactNode>> }>) {
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
          <RetroComputer programs={programs} />
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
