import * as stylex from "@stylexjs/stylex";

import type { IntroConfig } from "#lib/shared/desk/desk-configuration.schema";

import { desk } from "./reading-desk.style";
import { SocialLinks } from "./social-links.component";
export function Intro({ config }: Readonly<{ config: IntroConfig }>) {
  return (
    <section aria-label="Introduction" {...stylex.props(desk.intro)}>
      <p {...stylex.props(desk.eyebrow)}>
        <span {...stylex.props(desk.wave)} aria-hidden="true">
          👋
        </span>
        {config.greeting}
      </p>
      <h1 tabIndex={-1} {...stylex.props(desk.title)}>
        I’m <span {...stylex.props(desk.name)}>{config.name}.</span>
      </h1>
      <p {...stylex.props(desk.role)}>{config.role}</p>
      <p {...stylex.props(desk.body)}>{config.introduction}</p>
      <SocialLinks links={config.links} />
    </section>
  );
}
