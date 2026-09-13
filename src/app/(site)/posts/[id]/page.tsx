import * as stylex from "@stylexjs/stylex";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import DocumentView from "#components/ui/blocknote/document-view.component";
import { renderCachedArticle } from "#lib/server/content/document-cache.service";
import { readPublicPost } from "#lib/server/content/public-content.service";
import { documentText } from "#lib/shared/content/document.helper";
import { formatTime } from "#lib/shared/utils/date.helper";

import { contentStyles as styles } from "../../_components/layout/public-content.style";
import { ArticleToc } from "./_components/article-toc.component";

type Props = Readonly<{ params: Promise<{ id: string }> }>;
export async function generateMetadata({ params }: Props) {
  const post = await readPublicPost((await params).id);
  if (!post) return { title: "Post not found — Ech0xff" };
  return {
    title: `${post.title} — Ech0xff`,
    description: documentText(post.content).slice(0, 160),
  };
}
async function Article({ params }: Props) {
  const post = await readPublicPost((await params).id);
  if (!post) notFound();
  const { html, headings } = await renderCachedArticle(post.content);
  return (
    <article id="post-article" {...stylex.props(styles.page)}>
      <header>
        <h1 tabIndex={-1} {...stylex.props(styles.title)}>
          {post.title}
        </h1>
        <time dateTime={post.published_at} {...stylex.props(styles.date)}>
          {formatTime(post.published_at)}
        </time>
      </header>
      <div {...stylex.props(styles.body)}>
        <DocumentView html={html} />
      </div>
      {headings.length > 0 && <ArticleToc headings={headings} />}
    </article>
  );
}
export default function Page(props: Props) {
  return (
    <Suspense
      fallback={<output {...stylex.props(styles.page)}>Loading post…</output>}
    >
      <Article {...props} />
    </Suspense>
  );
}
