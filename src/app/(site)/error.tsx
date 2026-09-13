"use client";
import * as stylex from "@stylexjs/stylex";

import Button from "#components/ui/button.component";

import { contentStyles as styles } from "./_components/layout/public-content.style";
export default function ContentError({
  reset,
}: Readonly<{ reset: () => void }>) {
  return (
    <section {...stylex.props(styles.page)}>
      <h1 {...stylex.props(styles.title)}>Unable to load this page</h1>
      <p {...stylex.props(styles.description)}>Please try again in a moment.</p>
      <Button onClick={reset}>Try again</Button>
    </section>
  );
}
