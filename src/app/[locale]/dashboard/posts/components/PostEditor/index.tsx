"use client";

import { Edit, Eye, Save, X } from "lucide-react";

import DropdownPopover from "@/components/ui/DropdownPopover";
import StackX from "@/components/ui/StackX";
import StackY from "@/components/ui/StackY";
import { PostMarkdown } from "@/components/ui/markdown";
import { cn } from "@/lib/shared/utils";

import { BaseEditorProps } from "../../../components/EditorProvider";
import AuthorInput from "../../../components/ui/AuthorInput";
import DateTimeInput from "../../../components/ui/DateTimeInput";
import HeaderSection from "../../../components/ui/HeaderSection";
import SegmentedToggle from "../../../components/ui/SegmentedToggle";
import { useHooks } from "./use-hooks";

export { default as OpenButton } from "./OpenButton";
export default function PostEditor({
  id,
  className,
  onClose,
  onSaved,
}: BaseEditorProps) {
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
  } = useHooks({
    id,
    onSaved,
    onClose,
  });

  return (
    <StackY
      divided={true}
      className={cn("bg-white dark:bg-zinc-900", className)}
    >
      {/* Top Toolbar */}
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-zinc-500">
          Loading...
        </div>
      ) : (
        <>
          <HeaderSection title={pageTitle}>
            <DropdownPopover
              className="md:hidden"
              trigger={
                <button className="duration-300 hover:scale-110">
                  <Edit className="h-6 w-6" />
                </button>
              }
            >
              <StackY className="gap-1">
                <AuthorInput
                  value={form.author}
                  onChange={(value) => updateForm({ author: value })}
                  disabled={isPending}
                />
                <StackX className="w-full justify-between gap-1">
                  <DateTimeInput
                    className="ml-3"
                    value={form.published_at}
                    onChange={(value) => updateForm({ published_at: value })}
                    disabled={isPending}
                  />
                  <SegmentedToggle
                    className="ml-auto"
                    value={form.status}
                    onChange={(value) => updateForm({ status: value })}
                    options={[
                      { value: "hide", label: "Hide" },
                      { value: "show", label: "Show" },
                    ]}
                  />
                </StackX>
                <SegmentedToggle
                  value={viewMode}
                  onChange={setViewMode}
                  options={[
                    { value: "edit", label: "Edit" },
                    { value: "split", label: "Split" },
                    { value: "preview", label: "Preview" },
                  ]}
                />
              </StackY>
            </DropdownPopover>

            <StackX className="hidden gap-2 md:flex">
              <AuthorInput
                value={form.author}
                onChange={(value) => updateForm({ author: value })}
                disabled={isPending}
              />

              <SegmentedToggle
                value={viewMode}
                onChange={setViewMode}
                options={[
                  { value: "edit", label: "Edit" },
                  { value: "split", label: "Split" },
                  { value: "preview", label: "Preview" },
                ]}
              />

              <SegmentedToggle
                value={form.status}
                onChange={(value) => updateForm({ status: value })}
                options={[
                  { value: "hide", label: "Hide" },
                  { value: "show", label: "Show" },
                ]}
              />

              <DateTimeInput
                className="duration-300 hover:scale-110"
                value={form.published_at}
                onChange={(value) => updateForm({ published_at: value })}
                disabled={isPending}
              />
            </StackX>

            {/* Save Button */}
            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="duration-300 hover:scale-110 disabled:opacity-50"
            >
              <Save className="h-6 w-6" />
            </button>

            <button
              onClick={onClose}
              className="flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <X className="h-8 w-8" />
            </button>
          </HeaderSection>

          {/* Main Editor Area */}
          <StackX divided={true} className="min-h-0 flex-1 gap-0">
            {/* Left: Editor Panel */}
            <StackY
              divided={true}
              className={`overflow-hidden *:p-4 ${
                viewMode === "preview"
                  ? "hidden"
                  : viewMode === "split"
                    ? "w-1/2"
                    : "flex-1"
              }`}
            >
              {/* Editor Header */}
              <StackY className="shrink-0 gap-3">
                {/* Title Input */}
                <input
                  value={form.title}
                  onChange={(e) => updateForm({ title: e.target.value })}
                  type="text"
                  placeholder="Enter post title..."
                  className="w-full border-none text-xl font-semibold text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
                />

                {/* Tags */}
                <StackX className="flex-wrap items-center gap-4">
                  <StackX className="min-w-0 flex-1 flex-wrap items-center gap-2">
                    <span className="shrink-0 text-sm text-zinc-500">
                      Tags:
                    </span>
                    <StackX className="min-w-0 flex-1 flex-wrap items-center gap-1">
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
                        onChange={(e) =>
                          updateForm({ tagInput: e.target.value })
                        }
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
                    </StackX>
                  </StackX>
                </StackX>
              </StackY>

              {/* Content Editor */}
              <div className="min-h-0 flex-1">
                <textarea
                  value={form.content}
                  onChange={(e) => updateForm({ content: e.target.value })}
                  placeholder="Write your post content using Markdown..."
                  className="h-full w-full resize-none bg-transparent font-mono leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
                />
              </div>
            </StackY>

            {/* Right: Preview Panel */}
            <StackY
              divided={true}
              className={`flex flex-col overflow-hidden transition-all *:p-4 ${
                viewMode === "edit"
                  ? "hidden"
                  : viewMode === "split"
                    ? "w-1/2"
                    : "flex-1"
              }`}
            >
              {/* Preview Header */}
              <StackX className="items-center gap-2 text-sm text-zinc-500">
                <Eye className="h-4 w-4" />
                Preview
              </StackX>

              {/* Preview Content */}
              <div className="min-h-0 flex-1 overflow-auto">
                {/* Preview Title */}
                {form.title ? (
                  <h1 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {form.title}
                  </h1>
                ) : (
                  <h1 className="mb-4 text-2xl text-zinc-400 italic">
                    Untitled
                  </h1>
                )}

                {/* Preview Meta */}
                {(form.author || form.tags.length > 0) && (
                  <StackX className="mb-6 items-center gap-3 text-sm text-zinc-500">
                    {form.author && <span>{form.author}</span>}
                    {form.tags.length > 0 && (
                      <StackX className="items-center gap-1">
                        {form.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-blue-600 dark:text-blue-400"
                          >
                            #{tag}
                          </span>
                        ))}
                      </StackX>
                    )}
                  </StackX>
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
            </StackY>
          </StackX>
        </>
      )}
    </StackY>
  );
}
