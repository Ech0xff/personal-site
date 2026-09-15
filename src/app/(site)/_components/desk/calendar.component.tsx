import * as stylex from "@stylexjs/stylex";

import type { DeskItem } from "#lib/shared/desk/desk-item.schema";

import { foundation } from "../../_design/foundation.style";
import { objectMarker } from "../../_design/object-feedback.stylex";
import { DeskLink } from "../layout/desk-navigation.component";
import { ObjectFeedback } from "../object-feedback.component";
import { styles } from "./calendar.style";
export function Calendar({
  name,
  config,
}: Readonly<Pick<Extract<DeskItem, { type: "calendar" }>, "name" | "config">>) {
  return (
    <div {...stylex.props(styles.calendar, objectMarker)}>
      <DeskLink
        href="/events"
        aria-label="Explore events"
        {...stylex.props(foundation.objectLink)}
      >
        <span {...stylex.props(styles.rings)} aria-hidden="true">
          <i {...stylex.props(styles.ring)} />
          <i {...stylex.props(styles.ring)} />
        </span>
        <span {...stylex.props(styles.calendarPaper)}>
          <span {...stylex.props(styles.calendarTop)}>{config.heading}</span>
          <span {...stylex.props(styles.calendarMonth)}>{config.month}</span>
          <span {...stylex.props(styles.calendarDate)}>{config.day}</span>
          <span {...stylex.props(styles.calendarBottom)}>{config.caption}</span>
        </span>
      </DeskLink>
      <ObjectFeedback navigable label={name} />
    </div>
  );
}
