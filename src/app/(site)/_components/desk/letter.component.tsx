import * as stylex from "@stylexjs/stylex";

import { foundation } from "../../_design/foundation.style";
import { objectMarker } from "../../_design/object-feedback.stylex";
import { DeskLink } from "../layout/desk-navigation.component";
import { ObjectFeedback } from "../object-feedback.component";
import { styles } from "./letter.style";
export function Letter() {
  return (
    <DeskLink
      href="/thoughts"
      {...stylex.props(styles.letter, objectMarker, foundation.objectLink)}
      aria-label="Read thoughts"
    >
      <span {...stylex.props(styles.letterUnder)} />
      <span {...stylex.props(styles.letterSheet)}>
        <span {...stylex.props(styles.letterHeader)}>A NOTE TO SELF</span>
        <span {...stylex.props(styles.letterCopy)}>
          Pay attention.
          <br />
          The little things
          <br />
          are the big things.
        </span>
        <span {...stylex.props(styles.signature)}>— a passing thought</span>
      </span>
      <ObjectFeedback label="Thoughts" xstyle={styles.letterFrame} />
      <span {...stylex.props(styles.clip)} aria-hidden="true" />
    </DeskLink>
  );
}
