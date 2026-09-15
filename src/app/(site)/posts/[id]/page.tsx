import * as stylex from "@stylexjs/stylex";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import DocumentView from "#components/ui/blocknote/document-view.component";
import { renderCachedArticle } from "#lib/server/content/document-cache.service";
import { readPublicPost } from "#lib/server/content/public-content.service";
import { documentText } from "#lib/shared/content/document.helper";
import { formatTime } from "#lib/shared/utils/date.helper";

import { ContentShell } from "../../_components/layout/content-shell.component";
import { contentStyles as styles } from "../../_components/layout/public-content.style";
import {
  RouteReady,
  RoutePending,
} from "../../_components/layout/route-ready.component";
import { ArticleToc } from "./_components/article-toc.component";

type Props = Readonly<{ params: Promise<{ id: string }> }>;
export async function generateMetadata({ params }: Props) {
  const post = await readPublicPost((await params).id);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: documentText(post.content).slice(0, 160),
  };
}
async function Article({ params }: Props) {
  const { id } = await params;
  const post = await readPublicPost(id);
  if (!post) notFound();
  const { html, headings } = await renderCachedArticle(post.content);
  return (
    <RouteReady href={`/posts/${id}`}>
      <ContentShell as="article" id="post-article">
        <header>
          <h1 tabIndex={-1} {...stylex.props(styles.title)}>
            {post.title}
          </h1>
          <time dateTime={post.published_at} {...stylex.props(styles.date)}>
            {formatTime(post.published_at)}
          </time>
        </header>
        <div data-article-body {...stylex.props(styles.body)}>
          <DocumentView html={html} />
        </div>
        {headings.length > 0 && <ArticleToc headings={headings} />}
      </ContentShell>
    </RouteReady>
  );
}
export default function Page(props: Props) {
  return (
    <Suspense fallback={<RoutePending />}>
      <Article {...props} />
    </Suspense>
  );
}
