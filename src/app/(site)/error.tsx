"use client";
import * as stylex from "@stylexjs/stylex";

import Button from "#components/ui/button.component";

import { contentStyles as styles } from "./_components/layout/public-content.style";
import { RouteReady } from "./_components/layout/route-ready.component";
export default function ContentError({
  retry,
}: Readonly<{ retry: () => void }>) {
  return (
    <RouteReady>
      <section {...stylex.props(styles.page)}>
        <h1 tabIndex={-1} {...stylex.props(styles.title)}>
          Unable to load this page
        </h1>
        <p {...stylex.props(styles.description)}>
          Please try again in a moment.
        </p>
        <Button onClick={retry}>Try again</Button>
      </section>
    </RouteReady>
  );
}
