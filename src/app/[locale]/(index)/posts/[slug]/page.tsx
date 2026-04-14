import { ArrowLeft, Calendar, User } from "lucide-react";
import type { Metadata } from "next";
import { cacheTag } from "next/cache";

import PostTableOfContents from "@/components/features/posts/PostTableOfContents";
import ScrollToTopButton from "@/components/shared/ScrollToTopButton";
import CopyButton from "@/components/ui/CopyButton";
import { PostContent } from "@/components/ui/content";
import Link from "@/components/ui/Link";
import { CACHE_TAGS } from "@/lib/server/cache";
import { getT } from "@/lib/shared/i18n/tools";
import { fetchPost } from "@/lib/shared/services";
import { formatTime, getMarkdownHeadings } from "@/lib/shared/utils";

const getPostData = async (slug: string) => {
  "use cache";
  cacheTag(CACHE_TAGS.post(slug));
  return fetchPost(slug);
};

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  "use cache";
  const { locale, slug } = await params;
  cacheTag(CACHE_TAGS.post(slug));
  const t = getT("PostDetail", locale);
  const post = await getPostData(slug);

  if (!post || post.status !== "show") {
    return {
      title: t("metaNotFoundTitle"),
    };
  }

  return {
    title: post.title,
    description: post.content ? post.content.substring(0, 150) : "",
  };
}

export default async function PostPage({ params }: Props) {
  "use cache";
  const { locale, slug } = await params;
  cacheTag(CACHE_TAGS.post(slug));
  const t = getT("PostDetail", locale);
  const post = await getPostData(slug);
  const content = post?.content || "";

  // Handle 404 - also hide non-show posts
  if (!post || post.status !== "show") {
    return (
      <div className="py-20 text-center">
        <h1 className="mb-4 font-bold text-3xl">{t("notFoundTitle")}</h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          {t("notFoundDescription")}
        </p>
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 rounded bg-gray-900 px-6 py-3 text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
        >
          {t("backToPosts")}
        </Link>
      </div>
    );
  }

  const headings = getMarkdownHeadings(content).filter(
    (heading) => heading.depth >= 2 && heading.depth <= 4,
  );

  return (
    <>
      <article className="mx-auto flex w-full flex-1 flex-col px-4 pt-10 pb-10">
        {/* Header */}
        <header>
          <div className="mb-4 flex flex-col gap-4 text-4xl sm:flex-row sm:items-start sm:justify-between">
            <h1 className="font-bold leading-tight">{post.title}</h1>
            <CopyButton content={content} className="text-base" />
          </div>

          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm dark:text-gray-400">
            {post.author && (
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            )}

            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatTime(post.published_at, "MMMM D, YYYY")}
              </span>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 font-medium text-gray-800 text-xs dark:bg-gray-800 dark:text-gray-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <hr className="my-8 border-gray-200 dark:border-gray-800" />

        {/* Content */}
        <PostContent content={content} />

        {/* Footer */}
        <footer className="mt-auto">
          <hr className="my-8 border-gray-200 dark:border-gray-800" />
          <div className="flex items-center justify-between">
            <Link
              href="/posts"
              className="flex items-center gap-2 text-gray-500 text-sm transition-colors hover:text-gray-900 dark:hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4" />
              {t("backToPosts")}
            </Link>

            <ScrollToTopButton />
          </div>
        </footer>
      </article>

      <PostTableOfContents
        headings={headings}
        title={t("tableOfContents")}
        className="fixed top-24 right-(--layout-padding-x) hidden translate-x-full xl:block"
      />
    </>
  );
}
