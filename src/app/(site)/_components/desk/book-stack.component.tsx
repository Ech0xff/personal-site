import * as stylex from "@stylexjs/stylex";

import { foundation } from "../../_design/foundation.style";
import { objectMarker } from "../../_design/object-feedback.stylex";
import { DeskLink } from "../layout/desk-navigation.component";
import { ObjectFeedback } from "../object-feedback.component";
import { styles } from "./book-stack.style";
export function BookStack() {
  return (
    <DeskLink
      href="/posts"
      {...stylex.props(styles.books, objectMarker, foundation.objectLink)}
      aria-label="Browse posts"
    >
      <span {...stylex.props(styles.bookBack)} />
      <span {...stylex.props(styles.book)}>
        <span {...stylex.props(styles.bookIssue)}>NOTES & OBSERVATIONS</span>
        <span {...stylex.props(styles.bookTitle)}>
          Between
          <br />
          the lines.
        </span>
        <span {...stylex.props(styles.bookAuthor)}>WORDS BY ECH0XFF</span>
        <span {...stylex.props(styles.bookmark)} />
      </span>
      <ObjectFeedback label="Posts" xstyle={styles.bookFrame} />
    </DeskLink>
  );
}
