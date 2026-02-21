"use cache";

import { Metadata } from "next";

import { ArrowLeft, Calendar, User } from "lucide-react";

import ScrollToTopButton from "@/components/shared/ScrollToTopButton";
import Link from "@/components/ui/Link";
import { PostMarkdown } from "@/components/ui/markdown";
import { getI18n } from "@/i18n/tools";
import { fetchPost } from "@/lib/shared/services";
import { makeStaticClient } from "@/lib/shared/supabase";
import { formatTime } from "@/lib/shared/utils";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getI18n("PostDetail", locale);
  const client = makeStaticClient();
  const post = await fetchPost(slug, client);

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

export default async function PostPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getI18n("PostDetail", locale);
  const post = await fetchPost(slug);

  // Handle 404 - also hide non-show posts
  if (!post || post.status !== "show") {
    return (
      <div className="py-20 text-center">
        <h1 className="mb-4 text-3xl font-bold">{t("notFoundTitle")}</h1>
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

  return (
    <article className="mx-auto w-full px-4 pt-10 pb-10">
      {/* Header */}
      <header className="mb-8">
        <h1 className="mb-4 text-4xl leading-tight font-bold">{post.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
                className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <hr className="my-8 border-gray-200 dark:border-gray-800" />

      {/* Content */}
      <PostMarkdown content={post.content || ""} />

      {/* Footer */}
      <footer className="mt-auto">
        <hr className="my-8 border-gray-200 dark:border-gray-800" />
        <div className="flex items-center justify-between">
          <Link
            href="/posts"
            className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("backToPosts")}
          </Link>

          <ScrollToTopButton />
        </div>
      </footer>
    </article>
  );
}
