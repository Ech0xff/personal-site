import * as stylex from "@stylexjs/stylex";

import { foundation } from "../../_design/foundation.style";
import { objectMarker } from "../../_design/object-feedback.stylex";
import { DeskLink } from "../layout/desk-navigation.component";
import { ObjectFeedback } from "../object-feedback.component";
import { styles } from "./calendar.style";
export function Calendar() {
  return (
    <DeskLink
      href="/events"
      {...stylex.props(styles.calendar, objectMarker, foundation.objectLink)}
      aria-label="Explore events"
    >
      <span {...stylex.props(styles.rings)} aria-hidden="true">
        <i {...stylex.props(styles.ring)} />
        <i {...stylex.props(styles.ring)} />
      </span>
      <span {...stylex.props(styles.calendarPaper)}>
        <span {...stylex.props(styles.calendarTop)}>LIFE LATELY</span>
        <span {...stylex.props(styles.calendarMonth)}>SEPTEMBER</span>
        <span {...stylex.props(styles.calendarDate)}>12</span>
        <span {...stylex.props(styles.calendarBottom)}>one day at a time.</span>
      </span>
      <ObjectFeedback navigable label="Events" />
    </DeskLink>
  );
}
