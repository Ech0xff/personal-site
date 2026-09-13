import { Save, X } from "lucide-react";

import EventCard from "#components/features/events/event-card.component";
import Button from "#components/ui/button.component";
import { MarkdownEditor } from "#components/ui/codemirror";
import IconButton from "#components/ui/icon-button.component";
import Input from "#components/ui/input.component";
import SegmentedToggle from "#components/ui/segmented-toggle.component";
import Stack from "#components/ui/stack.component";
import { cn } from "#lib/shared/utils";

import type { BaseEditorProps } from "../../../_components/editor.type";
import DateTimeInput from "../../../_components/editor/date-time-input.component";
import HeaderSection from "../../../_components/editor/header-section.component";
import TagSelector from "../../../_components/tags/tag-selector.component";
import { useEventEditor } from "./event-editor.hook";

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

export default function EventEditor({
  id,
  className,
  onClose,
  onSaved,
}: BaseEditorProps) {
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
  } = useEventEditor({ id, onSaved, onClose });

  return (
    <Stack
      y
      className={cn(
        "divide-y divide-border-default bg-surface-card *:p-4",
        className,
      )}
    >
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-text-muted">
          Loading...
        </div>
      ) : (
        <>
          <HeaderSection title={pageTitle}>
            <SegmentedToggle
              value={form.status}
              onChange={(value) => updateForm({ status: value })}
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
            <IconButton
              onClick={handleSubmit}
              loading={isPending}
              aria-label="Save"
            >
              <Save className="h-6 w-6" />
            </IconButton>
            <IconButton onClick={onClose} className="gap-1" aria-label="Close">
              <X className="h-8 w-8" />
            </IconButton>
          </HeaderSection>
          <Stack x className="p-4">
            <Input
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              type="text"
              placeholder="Event title..."
              className="w-full bg-transparent"
            />
          </Stack>
          <Stack x className="flex-wrap gap-2">
            {COLOR_OPTIONS.map((option) => (
              <Button
                variant="ghost"
                key={option.value}
                onClick={() => updateForm({ color: option.value })}
                style={{ backgroundColor: option.value }}
                aria-label={`Select ${option.label} color`}
                aria-pressed={form.color === option.value}
                className={cn("h-8 w-8 rounded-full", {
                  "ring-2 ring-info-border ring-offset-2":
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
                className="flex items-center gap-1 rounded bg-surface-muted px-2 py-1 text-sm text-text-secondary"
              >
                #{tag}
                <Button
                  variant="ghost"
                  className="h-auto border-0 p-0 text-text-muted hover:bg-transparent hover:text-danger-text"
                  aria-label="Remove tag"
                  size="sm"
                  onClick={() => removeTag(index)}
                >
                  ×
                </Button>
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
            className="flex-1 overflow-hidden p-0! *:flex-1 *:overflow-auto"
          >
            <MarkdownEditor
              value={form.content}
              mode="live"
              onChange={(content) => updateForm({ content })}
              placeholder="Event content..."
            />
            <Stack x className="p-4">
              <EventCard event={form} />
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
}
