import * as stylex from "@stylexjs/stylex";
import { Suspense } from "react";

import { contentStyles } from "../_components/layout/public-content.style";
import { PostsIndex } from "./_components/posts-index.component";
import { postsStyles } from "./_components/posts-index.style";
export const metadata = { title: "Posts — Ech0xff" };
export default function Page() {
  return (
    <section {...stylex.props(contentStyles.page)}>
      <h1
        tabIndex={-1}
        {...stylex.props(contentStyles.title, postsStyles.title)}
      >
        Posts
      </h1>
      <Suspense fallback={<output>Loading posts…</output>}>
        <PostsIndex />
      </Suspense>
    </section>
  );
}
