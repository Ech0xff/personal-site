import * as stylex from "@stylexjs/stylex";

import { DeskLink } from "../../_components/layout/desk-navigation.component";
import { contentStyles as styles } from "../../_components/layout/public-content.style";
export default function PostNotFound() {
  return (
    <section {...stylex.props(styles.page)}>
      <h1 tabIndex={-1} {...stylex.props(styles.title)}>
        Post not found
      </h1>
      <p {...stylex.props(styles.description)}>This post is not available.</p>
      <DeskLink href="/posts">Back to posts</DeskLink>
    </section>
  );
}
