"use client";

import { Eye, X } from "lucide-react";

import { BaseEditorProps } from "@/app/dashboard/components/EditorProvider";
import DateTimeInput from "@/app/dashboard/components/ui/DateTimeInput";
import SegmentedToggle from "@/app/dashboard/components/ui/SegmentedToggle";
import { PostMarkdown } from "@/components/markdown";
import Button from "@/components/ui/Button";

import { useHooks } from "./use-hooks";

export { default as OpenButton } from "./OpenButton";
export default function PostEditor({ id, onClose, onSaved }: BaseEditorProps) {
  const {
    form,
    updateForm,
    addTag,
    removeTag,
    handleSubmit,
    viewMode,
    setViewMode,
    isPending,
    isLoading,
    pageTitle,
    submitButtonText,
  } = useHooks({
    id,
    onSaved,
    onClose,
  });

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
          <SegmentedToggle
            value={viewMode}
            onChange={setViewMode}
            options={[
              { value: "edit", label: "Edit" },
              { value: "split", label: "Split" },
              { value: "preview", label: "Preview" },
            ]}
          />

          {/* Status Toggle */}
          <SegmentedToggle
            value={form.status}
            onChange={(value) => updateForm({ status: value })}
            options={[
              { value: "hide", label: "Hide" },
              { value: "show", label: "Show" },
            ]}
          />

          {/* Published At */}
          <DateTimeInput
            value={form.publishedAt}
            onChange={(value) => updateForm({ publishedAt: value })}
            disabled={isPending}
          />

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
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              type="text"
              placeholder="Enter post title..."
              className="w-full border-none bg-transparent text-xl font-semibold text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
            />

            {/* Author and Tags */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">Author:</span>
                <input
                  value={form.author}
                  onChange={(e) => updateForm({ author: e.target.value })}
                  type="text"
                  placeholder="Optional"
                  className="w-24 rounded border border-zinc-200 bg-transparent px-2 py-1 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                <span className="shrink-0 text-sm text-zinc-500">Tags:</span>
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                  {form.tags.map((tag, index) => (
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
                    value={form.tagInput}
                    onChange={(e) => updateForm({ tagInput: e.target.value })}
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
              value={form.content}
              onChange={(e) => updateForm({ content: e.target.value })}
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
            {form.title ? (
              <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {form.title}
              </h1>
            ) : (
              <h1 className="mb-4 text-2xl text-zinc-400 italic">Untitled</h1>
            )}

            {/* Preview Meta */}
            {(form.author || form.tags.length > 0) && (
              <div className="mb-6 flex items-center gap-3 text-sm text-zinc-500">
                {form.author && <span>{form.author}</span>}
                {form.tags.length > 0 && (
                  <div className="flex items-center gap-1">
                    {form.tags.map((tag) => (
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
            {form.content ? (
              <PostMarkdown content={form.content} />
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
