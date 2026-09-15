import * as stylex from "@stylexjs/stylex";

import type { DeskItem } from "#lib/shared/desk/desk-item.schema";

import { foundation } from "../../_design/foundation.style";
import { objectMarker } from "../../_design/object-feedback.stylex";
import { DeskLink } from "../layout/desk-navigation.component";
import { ObjectFeedback } from "../object-feedback.component";
import { styles } from "./book-stack.style";
export function BookStack({
  name,
  config,
}: Readonly<Pick<Extract<DeskItem, { type: "books" }>, "name" | "config">>) {
  return (
    <div {...stylex.props(styles.books, objectMarker)}>
      <DeskLink
        href="/posts"
        aria-label="Browse posts"
        {...stylex.props(foundation.objectLink)}
      >
        <span {...stylex.props(styles.bookBack)} />
        <span {...stylex.props(styles.book)}>
          <span {...stylex.props(styles.bookIssue)}>{config.eyebrow}</span>
          <span {...stylex.props(styles.bookTitle)}>{config.title}</span>
          <span {...stylex.props(styles.bookAuthor)}>{config.author}</span>
          <span {...stylex.props(styles.bookmark)} />
        </span>
      </DeskLink>
      <ObjectFeedback navigable label={name} xstyle={styles.bookFrame} />
    </div>
  );
}
