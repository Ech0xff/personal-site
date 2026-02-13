"use client";

import { X } from "lucide-react";

import { BaseEditorProps } from "@/app/dashboard/components/EditorProvider";
import SegmentedToggle from "@/app/dashboard/components/ui/SegmentedToggle";
import Button from "@/components/ui/Button";
import { Status } from "@/types";

import { useHooks } from "./use-hooks";

const COLOR_OPTIONS = [
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "gray", label: "Gray", class: "bg-gray-500" },
];

export { default as OpenButton } from "./OpenButton";
export default function EventEditor({ id, onClose, onSaved }: BaseEditorProps) {
  const {
    form,
    updateForm,
    addTag,
    removeTag,
    handleSubmit,
    isPending,
    isLoading,
    pageTitle,
    submitButtonText,
  } = useHooks({ id, onSaved, onClose });

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
          <SegmentedToggle
            value={form.status}
            onChange={(value) => updateForm({ status: value as Status })}
            options={[
              { value: "hide", label: "Hide" },
              { value: "show", label: "Show" },
            ]}
          />
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
      <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-auto p-6">
        {/* Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Title
          </label>
          <input
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
            type="text"
            placeholder="Event title..."
            className="w-full rounded-lg border border-zinc-200 bg-transparent px-4 py-2 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
          />
        </div>

        {/* Publish Time and Color */}
        <div className="flex gap-6">
          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Published Time
            </label>
            <input
              value={form.publishedAt}
              onChange={(e) => updateForm({ publishedAt: e.target.value })}
              type="datetime-local"
              className="w-full rounded-lg border border-zinc-200 bg-transparent px-4 py-2 text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
            />
          </div>

          <div className="flex-1">
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateForm({ color: option.value })}
                  className={`h-8 w-8 rounded-full ${option.class} ${
                    form.color === option.value
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : ""
                  }`}
                  title={option.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Description (optional)
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateForm({ description: e.target.value })}
            placeholder="Event description..."
            className="h-32 w-full resize-none rounded-lg border border-zinc-200 bg-transparent p-4 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Tags (optional)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {form.tags.map((tag, index) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded bg-zinc-100 px-2 py-1 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
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
              className="w-24 rounded border border-zinc-200 bg-transparent px-2 py-1 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
