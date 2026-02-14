"use client";

import { X } from "lucide-react";

import { BaseEditorProps } from "@/app/dashboard/components/EditorProvider";
import DateTimeInput from "@/app/dashboard/components/ui/DateTimeInput";
import SegmentedToggle from "@/app/dashboard/components/ui/SegmentedToggle";
import Button from "@/components/ui/Button";
import StackY from "@/components/ui/StackY";
import { cn } from "@/lib/shared/utils";
import { Status } from "@/types";

import EventCard from "../../../../../components/features/events/EventCard";
import { useHooks } from "./use-hooks";

const COLOR_OPTIONS = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#22C55E", label: "Green" },
  { value: "#EF4444", label: "Red" },
  { value: "#EAB308", label: "Yellow" },
  { value: "#A855F7", label: "Purple" },
  { value: "#EC4899", label: "Pink" },
  { value: "#F97316", label: "Orange" },
  { value: "#6B7280", label: "Gray" },
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
    <StackY className="absolute inset-0 z-50 bg-white dark:bg-zinc-900">
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
          <DateTimeInput
            value={form.publishedAt}
            onChange={(value) => updateForm({ publishedAt: value })}
            disabled={isPending}
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

      <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
        <input
          value={form.title}
          onChange={(e) => updateForm({ title: e.target.value })}
          type="text"
          placeholder="Event title..."
          className="w-full rounded-lg bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
        />
      </div>

      <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => updateForm({ color: option.value })}
              style={{ backgroundColor: option.value }}
              className={cn("h-8 w-8 rounded-full", {
                "ring-2 ring-blue-500 ring-offset-2":
                  form.color === option.value,
              })}
              title={option.label}
            />
          ))}
        </div>
      </div>

      <div className="border-b border-zinc-200 p-4 dark:border-zinc-800">
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

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 border-b border-zinc-200 p-4 dark:border-zinc-800">
          <textarea
            value={form.description}
            onChange={(e) => updateForm({ description: e.target.value })}
            placeholder="Event description..."
            className="h-full w-full resize-none rounded-lg bg-transparent p-4 text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
          />
        </div>

        <EventCard
          className="flex-1 overflow-auto border-b border-zinc-200 p-4 dark:border-zinc-800"
          event={{ ...form, published_at: form.publishedAt }}
        />
      </div>
    </StackY>
  );
}
