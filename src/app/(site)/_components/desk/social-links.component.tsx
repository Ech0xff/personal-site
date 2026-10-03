import * as stylex from "@stylexjs/stylex";

import { SocialIcon } from "#components/shared/social-icon.component";
import { Magnetic } from "#components/ui/magnetic.component";
import { color, motionToken, shape, space } from "#design/tokens.stylex";
import type { IntroConfig } from "#lib/shared/desk/desk-configuration.schema";

import { foundation } from "../../_design/foundation.style";

const styles = stylex.create({
  root: {
    display: "flex",
    justifyContent: "center",
    gap: space.md,
    marginTop: space.md,
  },
  link: {
    display: "grid",
    borderWidth: 0,
    borderStyle: "solid",
    backgroundColor: "transparent",
    padding: 0,
    cursor: { default: "pointer", ":disabled": "default" },
    placeItems: "center",
    width: shape.touch,
    height: shape.touch,
    borderRadius: shape.round,
    color: {
      default: color.text,
      ":hover": color.accent,
      ":focus-visible": color.accent,
    },
    transition: `color ${motionToken.normal} ease`,
  },
});
export function SocialLinks({
  links,
}: Readonly<{ links: IntroConfig["links"] }>) {
  return (
    <div {...stylex.props(styles.root)} aria-label="Elsewhere">
      {(["github", "email", "x", "bilibili"] as const).map((kind) => {
        const href = links[kind];
        const label = {
          github: "GitHub",
          email: "Email",
          x: "X",
          bilibili: "Bilibili",
        }[kind];
        const icon = <SocialIcon kind={kind} />;
        return href ? (
          <a
            key={kind}
            href={href}
            aria-label={label}
            {...stylex.props(styles.link, foundation.focus)}
          >
            <Magnetic>{icon}</Magnetic>
          </a>
        ) : (
          <button
            key={kind}
            type="button"
            aria-disabled="true"
            aria-label={`${label} — coming soon`}
            title={`${label} — coming soon`}
            {...stylex.props(styles.link)}
          >
            <Magnetic>{icon}</Magnetic>
          </button>
        );
      })}
    </div>
  );
}
