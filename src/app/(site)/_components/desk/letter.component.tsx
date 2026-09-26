import * as stylex from "@stylexjs/stylex";

import type { DeskItem } from "#lib/shared/desk/desk-configuration.schema";

import { foundation } from "../../_design/foundation.style";
import { objectMarker } from "../../_design/object-feedback.stylex";
import { DeskLink } from "../layout/desk-navigation.component";
import { ObjectFeedback } from "../object-feedback.component";
import { styles } from "./letter.style";
export function Letter({
  name,
  config,
}: Readonly<Pick<Extract<DeskItem, { type: "letter" }>, "name" | "config">>) {
  return (
    <div {...stylex.props(styles.letter, objectMarker)}>
      <span {...stylex.props(styles.letterUnder)} />
      <DeskLink
        href="/thoughts"
        aria-label="Read thoughts"
        {...stylex.props(foundation.objectLink, styles.letterSheet)}
      >
        <span {...stylex.props(styles.letterHeader)}>{config.heading}</span>
        <span {...stylex.props(styles.letterCopy)}>{config.body}</span>
        <span {...stylex.props(styles.signature)}>{config.signature}</span>
      </DeskLink>
      <span {...stylex.props(styles.clip)} aria-hidden="true" />
      <ObjectFeedback navigable label={name} xstyle={styles.letterFrame} />
    </div>
  );
}
