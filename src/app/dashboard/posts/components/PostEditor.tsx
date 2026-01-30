"use client";

import { useEffect, useState, useTransition } from "react";

import { Eye, X } from "lucide-react";

import MarkdownPreview from "@/components/MarkdownPreview";
import Button from "@/components/ui/Button";

import { getPost, savePost } from "../actions";

interface PostEditorProps {
  postId: string | null; // null for new post
  onClose: () => void;
  onSaved: () => void;
}

type ViewMode = "edit" | "preview" | "split";
type PostStatus = "draft" | "published";

export default function PostEditor({
  postId,
  onClose,
  onSaved,
}: PostEditorProps) {
  const isNewMode = postId === null;

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(!isNewMode);
  const [errorMessage, setErrorMessage] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [status, setStatus] = useState<PostStatus>("draft");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // View mode
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  // Load post data for edit mode
  useEffect(() => {
    if (isNewMode) return;

    const loadPost = async () => {
      setIsLoading(true);
      const post = await getPost(postId);
      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setAuthor(post.author || "");
        setStatus((post.status as PostStatus) || "draft");
        setTags(post.tags || []);
      } else {
        setErrorMessage("Failed to load post");
      }
      setIsLoading(false);
    };

    loadPost();
  }, [postId, isNewMode]);

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      setErrorMessage("Please enter a title");
      return;
    }
    if (!content.trim()) {
      setErrorMessage("Please enter content");
      return;
    }

    setErrorMessage("");

    startTransition(async () => {
      const result = await savePost({
        id: postId || undefined,
        title: title.trim(),
        content: content.trim(),
        author: author.trim() || null,
        status,
        tags: tags.length > 0 ? tags : null,
      });

      if (result.success) {
        onSaved();
      } else {
        setErrorMessage(result.error || "Failed to save post");
      }
    });
  };

  const pageTitle = isNewMode ? "New Post" : "Edit Post";
  const submitButtonText = isPending
    ? "Saving..."
    : isNewMode
      ? "Create Post"
      : "Update Post";

  if (isLoading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex flex-col bg-white dark:bg-zinc-900">
      {/* Top Toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            <button
              onClick={() => setViewMode("edit")}
              className={`rounded-md px-3 py-1.5 text-sm transition-all ${
                viewMode === "edit"
                  ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              Edit
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`rounded-md px-3 py-1.5 text-sm transition-all ${
                viewMode === "split"
                  ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`rounded-md px-3 py-1.5 text-sm transition-all ${
                viewMode === "preview"
                  ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              Preview
            </button>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            <button
              onClick={() => setStatus("draft")}
              className={`rounded-md px-3 py-1.5 text-sm transition-all ${
                status === "draft"
                  ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => setStatus("published")}
              className={`rounded-md px-3 py-1.5 text-sm transition-all ${
                status === "published"
                  ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              }`}
            >
              Published
            </button>
          </div>

          {/* Save Button */}
          <Button onClick={handleSubmit} disabled={isPending}>
            {submitButtonText}
          </Button>

          <button
            onClick={onClose}
            className="flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            <X className="h-8 w-8" />
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="shrink-0 border-b border-red-200 bg-red-50 px-6 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex min-h-0 flex-1 gap-0">
        {/* Left: Editor Panel */}
        <div
          className={`flex flex-col overflow-hidden border-r border-zinc-200 transition-all dark:border-zinc-800 ${
            viewMode === "preview"
              ? "hidden"
              : viewMode === "split"
                ? "w-1/2"
                : "flex-1"
          }`}
        >
          {/* Editor Header */}
          <div className="shrink-0 space-y-3 border-b border-zinc-200 p-4 dark:border-zinc-800">
            {/* Title Input */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Enter post title..."
              className="w-full border-none bg-transparent text-xl font-semibold text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
            />

            {/* Author and Tags */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">Author:</span>
                <input
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  type="text"
                  placeholder="Optional"
                  className="w-24 rounded border border-zinc-200 bg-transparent px-2 py-1 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                <span className="shrink-0 text-sm text-zinc-500">Tags:</span>
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                  {tags.map((tag, index) => (
                    <span
                      key={tag}
                      className="flex shrink-0 items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="transition-colors hover:text-red-500"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                    type="text"
                    placeholder="Add tag..."
                    className="w-20 shrink-0 rounded border border-zinc-200 bg-transparent px-2 py-0.5 text-xs text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Content Editor */}
          <div className="min-h-0 flex-1 p-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content using Markdown..."
              className="h-full w-full resize-none bg-transparent font-mono leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Right: Preview Panel */}
        <div
          className={`flex flex-col overflow-hidden transition-all ${
            viewMode === "edit"
              ? "hidden"
              : viewMode === "split"
                ? "w-1/2"
                : "flex-1"
          }`}
        >
          {/* Preview Header */}
          <div className="shrink-0 border-b border-zinc-200 p-4 dark:border-zinc-800">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Eye className="h-4 w-4" />
              Preview
            </div>
          </div>

          {/* Preview Content */}
          <div className="min-h-0 flex-1 overflow-auto p-6">
            {/* Preview Title */}
            {title ? (
              <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {title}
              </h1>
            ) : (
              <h1 className="mb-4 text-2xl text-zinc-400 italic">Untitled</h1>
            )}

            {/* Preview Meta */}
            {(author || tags.length > 0) && (
              <div className="mb-6 flex items-center gap-3 text-sm text-zinc-500">
                {author && <span>{author}</span>}
                {tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-blue-600 dark:text-blue-400"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Markdown Content Preview */}
            {content ? (
              <MarkdownPreview content={content} />
            ) : (
              <p className="text-sm text-zinc-400 italic">
                Start writing and the preview will appear here...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
