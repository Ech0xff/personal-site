"use client";

import { Save, X } from "lucide-react";

import EventCard from "@/components/features/events/EventCard";
import Stack from "@/components/ui/Stack";
import { useCurrentLocale } from "@/lib/client/locale";
import { cn } from "@/lib/shared/utils";
import type { Status } from "@/types";

import type { BaseEditorProps } from "../../../_components/editor-types";
import DateTimeInput from "../../../_components/ui/DateTimeInput";
import HeaderSection from "../../../_components/ui/HeaderSection";
import SegmentedToggle from "../../../_components/ui/SegmentedToggle";
import TagSelector from "../../../_components/ui/TagSelector";
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
  className,
  onClose,
  onSaved,
}: BaseEditorProps) {
  const locale = useCurrentLocale();
  const {
    form,
    tags,
    updateForm,
    selectTag,
    removeTag,
    deselectTag,
    handleSubmit,
    isPending,
    isLoading,
    pageTitle,
  } = useHooks({ id, onSaved, onClose });

  return (
    <Stack
      y
      divide={true}
      className={cn("bg-white *:p-4 dark:bg-zinc-900", className)}
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-zinc-500">
          Loading...
        </div>
      ) : (
        <>
          <HeaderSection title={pageTitle}>
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
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isPending}
              className="duration-300 hover:scale-110 disabled:opacity-50"
            >
              <Save className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <X className="h-8 w-8" />
            </button>
          </HeaderSection>
          <Stack x className="p-4">
            <input
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              type="text"
              placeholder="Event title..."
              className="w-full rounded-lg bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
            />
          </Stack>
          <Stack x className="flex-wrap gap-2">
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
          </Stack>
          <Stack x className="flex-wrap items-center gap-2">
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
            <TagSelector
              tags={tags}
              onSelect={(tagId) => {
                const tag = tags.find((item) => item.id === tagId);
                if (tag) selectTag(tag.name);
              }}
              onDeselect={deselectTag}
              selectedTags={form.tags}
            />
          </Stack>
          <Stack
            y
            divide={true}
            className="flex-1 overflow-hidden p-0! *:flex-1 *:overflow-auto *:p-4"
          >
            <Stack x>
              <textarea
                value={form.content}
                onChange={(e) => updateForm({ content: e.target.value })}
                placeholder="Event content..."
                className="w-full resize-none rounded-lg bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100"
              />
            </Stack>

            <Stack x>
              <EventCard event={form} locale={locale} />
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
}
