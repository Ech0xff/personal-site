import { Metadata } from "next";
import Link from "next/link";

import { ArrowLeft, Calendar, User } from "lucide-react";

import ScrollToTopButton from "@/components/ScrollToTopButton";
import { PostMarkdown } from "@/components/markdown";
import { REVALIDATE_CONFIG } from "@/lib/cache";
import { getCachedPost } from "@/lib/cache/posts";

export const revalidate = REVALIDATE_CONFIG.DETAIL;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getCachedPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.content ? post.content.substring(0, 150) : "",
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getCachedPost(slug);

  // Handle 404
  if (!post) {
    return (
      <div className="py-20 text-center">
        <h1 className="mb-4 text-3xl font-bold">Post Not Found</h1>
        <p className="mb-8 text-gray-500 dark:text-gray-400">
          Sorry, the post you are looking for does not exist or has been
          deleted.
        </p>
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 rounded bg-gray-900 px-6 py-3 text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
        >
          Back to Posts
        </Link>
      </div>
    );
  }

  // Format Date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="mx-auto w-full px-4 pt-10 pb-20">
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

          {post.created_at && (
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(post.created_at)}
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

      <hr className="my-8 border-gray-200 dark:border-gray-800" />

      {/* Footer */}
      <footer className="pt-4">
        <div className="flex items-center justify-between">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Posts
          </Link>

          <ScrollToTopButton />
        </div>
      </footer>
    </article>
  );
}
