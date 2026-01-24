import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, User } from "lucide-react";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import "highlight.js/styles/github-dark.css";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await supabase
    .from("posts")
    .select("title, content")
    .eq("id", slug)
    .single();

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

  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", slug)
    .single();

  // Handle 404
  if (!post) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Sorry, the post you are looking for does not exist or has been
          deleted.
        </p>
        <Link
          href="/posts"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white dark:bg-white dark:text-black rounded hover:opacity-90 transition-opacity"
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
    <article className="w-full mx-auto pt-10 pb-20 px-4">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-4xl font-bold leading-tight mb-4">{post.title}</h1>

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
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag: string) => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <hr className="my-8 border-gray-200 dark:border-gray-800" />

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {post.content || ""}
        </ReactMarkdown>
      </div>

      <hr className="my-8 border-gray-200 dark:border-gray-800" />

      {/* Footer */}
      <footer className="pt-4">
        <div className="flex justify-between items-center">
          <Link
            href="/posts"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
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
