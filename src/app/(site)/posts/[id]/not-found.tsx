import * as stylex from "@stylexjs/stylex";

import { ContentShell } from "../../_components/layout/content-shell.component";
import { DeskLink } from "../../_components/layout/desk-navigation.component";
import { contentStyles as styles } from "../../_components/layout/public-content.style";
import { RouteReady } from "../../_components/layout/route-ready.component";
export default function PostNotFound() {
  return (
    <RouteReady>
      <ContentShell>
        <h1 tabIndex={-1} {...stylex.props(styles.title)}>
          Post not found
        </h1>
        <p {...stylex.props(styles.description)}>This post is not available.</p>
        <DeskLink href="/posts">Back to posts</DeskLink>
      </ContentShell>
    </RouteReady>
  );
}
