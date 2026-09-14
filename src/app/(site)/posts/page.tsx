import { Suspense } from "react";

import { RoutePending } from "../_components/layout/route-ready.component";
import { PostsIndex } from "./_components/posts-index.component";
export const metadata = { title: "Posts — Ech0xff" };
export default function Page() {
  return (
    <Suspense fallback={<RoutePending />}>
      <PostsIndex />
    </Suspense>
  );
}
