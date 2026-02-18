"use client";

import { X } from "lucide-react";

import { BaseEditorProps } from "@/app/dashboard/components/EditorProvider";
import DateTimeInput from "@/app/dashboard/components/ui/DateTimeInput";
import SegmentedToggle from "@/app/dashboard/components/ui/SegmentedToggle";
import EventCard from "@/components/features/events/EventCard";
import Button from "@/components/ui/Button";
import StackX from "@/components/ui/StackX";
import StackY from "@/components/ui/StackY";
import { cn } from "@/lib/shared/utils";
import { Status } from "@/types";

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
export default function EventEditor({
  id,
  show,
  onClose,
  onSaved,
}: BaseEditorProps) {
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

  if (!show) {
    return null;
  }

  if (isLoading) {
    return (
      <StackX className="absolute inset-0 z-50 items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-zinc-500">Loading...</div>
      </StackX>
    );
  }

  return (
    <StackY
      divided={true}
      className="absolute inset-0 z-50 bg-white *:p-4 dark:bg-zinc-900"
    >
      <StackX className="items-center justify-between">
        <StackX>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {pageTitle}
          </h1>
        </StackX>
        <StackX className="items-center gap-3">
          <SegmentedToggle
            value={form.status}
            onChange={(value) => updateForm({ status: value as Status })}
            options={[
              { value: "hide", label: "Hide" },
              { value: "show", label: "Show" },
            ]}
          />
          <DateTimeInput
            value={form.published_at}
            onChange={(value) => updateForm({ published_at: value })}
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
        </StackX>
      </StackX>
      <StackX>
        <input
          value={form.title}
          onChange={(e) => updateForm({ title: e.target.value })}
          type="text"
          placeholder="Event title..."
          className="w-full rounded-lg bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
        />
      </StackX>
      <StackX className="flex-wrap gap-2">
        {COLOR_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => updateForm({ color: option.value })}
            style={{ backgroundColor: option.value }}
            className={cn("h-8 w-8 rounded-full", {
              "ring-2 ring-blue-500 ring-offset-2": form.color === option.value,
            })}
            title={option.label}
          />
        ))}
      </StackX>
      <StackX className="flex-wrap items-center gap-2">
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
      </StackX>
      <StackY
        divided={true}
        className="flex-1 overflow-hidden p-0! *:flex-1 *:overflow-auto *:p-4"
      >
        <StackX>
          <textarea
            value={form.content}
            onChange={(e) => updateForm({ content: e.target.value })}
            placeholder="Event content..."
            className="w-full resize-none rounded-lg bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
          />
        </StackX>

        <StackX>
          <EventCard event={form} />
        </StackX>
      </StackY>
    </StackY>
  );
}
