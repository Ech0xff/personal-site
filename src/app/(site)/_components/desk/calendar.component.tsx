import * as stylex from "@stylexjs/stylex";

import type { DeskItem } from "#lib/shared/desk/desk-item.schema";

import { foundation } from "../../_design/foundation.style";
import { objectMarker } from "../../_design/object-feedback.stylex";
import { ObjectFeedback } from "../object-feedback.component";
import { useCalendarDate } from "./calendar-date.hook";
import { styles } from "./calendar.style";
export function Calendar({
  name,
  config,
}: Readonly<Pick<Extract<DeskItem, { type: "calendar" }>, "name" | "config">>) {
  const today = useCalendarDate();
  return (
    <div {...stylex.props(styles.calendar, objectMarker)}>
      <div {...stylex.props(foundation.objectLink)}>
        <span {...stylex.props(styles.rings)} aria-hidden="true">
          <i {...stylex.props(styles.ring)} />
          <i {...stylex.props(styles.ring)} />
        </span>
        <span {...stylex.props(styles.calendarPaper)}>
          <span {...stylex.props(styles.calendarTop)}>{config.heading}</span>
          <span {...stylex.props(styles.calendarMonth)}>
            {today
              ? today
                  .toLocaleDateString("en-US", { month: "long" })
                  .toUpperCase()
              : "TODAY"}
          </span>
          <span {...stylex.props(styles.calendarDate)}>
            {today ? today.getDate() : "—"}
          </span>
          <span {...stylex.props(styles.calendarBottom)}>{config.caption}</span>
        </span>
      </div>
      <ObjectFeedback label={name} />
    </div>
  );
}
