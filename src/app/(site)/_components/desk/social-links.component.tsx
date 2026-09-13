import * as stylex from "@stylexjs/stylex";

import { Magnetic } from "#components/ui/magnetic.component";
import { color, motionToken, shape, space } from "#design/tokens.stylex";

import { foundation } from "../../_design/foundation.style";
import { socialLinks } from "./profile.const";

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
  icon: {
    width: "23px",
    height: "23px",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  },
});
const paths = {
  github:
    "M8 20c-4 1-4-2-6-2m12 4v-4c0-1 .3-2 1-2.5 3-.4 5-1.5 5-5a4 4 0 0 0-1-3c.3-1 .3-2-.2-3-1.5 0-3 1-3.5 1a12 12 0 0 0-6.6 0C8 4.5 6.5 3.5 5 3.5c-.5 1-.5 2-.2 3a4 4 0 0 0-1 3c0 3.5 2 4.6 5 5-.7.5-1 1.5-1 2.5v5",
  email: "M3 5h18v14H3z M3 6l9 7 9-7",
  x: "M4 3h4l12 18h-4z M20 3l-7 8 M4 21l7-8",
  bilibili:
    "M8 2l3 4 M17 2l-3 4 M5 6h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z M8 11v3 M16 11v3 M10 17l2 1 2-1",
} as const;
export function SocialLinks() {
  return (
    <div {...stylex.props(styles.root)} aria-label="Elsewhere">
      {(["github", "email", "x", "bilibili"] as const).map((kind) => {
        const href = socialLinks[kind];
        const label = {
          github: "GitHub",
          email: "Email",
          x: "X",
          bilibili: "Bilibili",
        }[kind];
        const icon = (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            {...stylex.props(styles.icon)}
          >
            <path d={paths[kind]} />
          </svg>
        );
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
