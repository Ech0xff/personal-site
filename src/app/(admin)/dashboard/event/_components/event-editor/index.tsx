import * as stylex from "@stylexjs/stylex";
import { Save, X } from "lucide-react";

import Button from "#components/ui/button.component";
import { MarkdownEditor } from "#components/ui/codemirror";
import IconButton from "#components/ui/icon-button.component";
import Input from "#components/ui/input.component";
import SegmentedToggle from "#components/ui/segmented-toggle.component";
import Stack from "#components/ui/stack.component";
import { color, font, space, shape } from "#design/tokens.stylex";

import type { BaseEditorProps } from "../../../_components/editor.type";
import DateTimeInput from "../../../_components/editor/date-time-input.component";
import HeaderSection from "../../../_components/editor/header-section.component";
import EventCard from "../../../_components/features/events/event-card.component";
import TagSelector from "../../../_components/tags/tag-selector.component";
import { useEventEditor } from "./event-editor.hook";
const styles = stylex.create({
  column: {
    backgroundColor: color.surface,
  },
  container: {
    display: "flex",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    alignItems: "center",
    justifyContent: "center",
    color: color.muted,
  },
  icon: {
    height: space.lg,
    width: space.lg,
  },
  icon2: {
    gap: space.xxs,
  },
  icon3: {
    height: space.xl,
    width: space.xl,
  },
  row: {
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
  },
  input: {
    width: "100%",
    backgroundColor: "transparent",
  },
  row2: {
    flexWrap: "wrap",
    gap: space.xs,
  },
  button: {
    height: space.xl,
    width: space.xl,
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
  },
  button2: {
    outlineStyle: "solid",
    outlineWidth: "2px",
    outlineColor: color.infoBorder,
    outlineOffset: "2px",
  },
  row3: {
    flexWrap: "wrap",
    alignItems: "center",
    gap: space.xs,
  },
  label: {
    display: "flex",
    alignItems: "center",
    gap: space.xxs,
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    backgroundColor: color.surfaceMuted,
    paddingLeft: space.xs,
    paddingRight: space.xs,
    paddingTop: space.xxs,
    paddingBottom: space.xxs,
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.secondary,
  },
  button3: {
    height: "auto",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    paddingTop: "0px",
    paddingRight: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px",
    color: {
      default: color.muted,
      ":hover": color.dangerText,
    },
    backgroundColor: {
      default: null,
      ":hover": "transparent",
    },
  },
  column2: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "hidden",
    paddingTop: "0px",
    paddingRight: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px",
  },
  icon4: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "auto",
  },
  row4: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "auto",
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
  },
});
const COLOR_OPTIONS = [
  {
    value: "#3B82F6",
    label: "Blue",
  },
  {
    value: "#22C55E",
    label: "Green",
  },
  {
    value: "#EF4444",
    label: "Red",
  },
  {
    value: "#EAB308",
    label: "Yellow",
  },
  {
    value: "#A855F7",
    label: "Purple",
  },
  {
    value: "#EC4899",
    label: "Pink",
  },
  {
    value: "#F97316",
    label: "Orange",
  },
  {
    value: "#6B7280",
    label: "Gray",
  },
];
export default function EventEditor({
  id,
  xstyle,
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
  } = useEventEditor({
    id,
    onSaved,
    onClose,
  });
  return (
    <Stack y divide xstyle={[styles.column, xstyle]}>
      {isLoading ? (
        <div {...stylex.props(styles.container)}>Loading...</div>
      ) : (
        <>
          <HeaderSection title={pageTitle}>
            <SegmentedToggle
              value={form.status}
              onChange={(value) =>
                updateForm({
                  status: value,
                })
              }
              options={[
                {
                  value: "hide",
                  label: "Hide",
                },
                {
                  value: "show",
                  label: "Show",
                },
              ]}
            />
            <DateTimeInput
              value={form.published_at}
              onChange={(value) =>
                updateForm({
                  published_at: value,
                })
              }
              disabled={isPending}
            />
            <IconButton
              onClick={handleSubmit}
              loading={isPending}
              aria-label="Save"
            >
              <Save {...stylex.props(styles.icon)} />
            </IconButton>
            <IconButton
              onClick={onClose}
              xstyle={styles.icon2}
              aria-label="Close"
            >
              <X {...stylex.props(styles.icon3)} />
            </IconButton>
          </HeaderSection>
          <Stack x xstyle={styles.row}>
            <Input
              value={form.title}
              onChange={(e) =>
                updateForm({
                  title: e.target.value,
                })
              }
              type="text"
              placeholder="Event title..."
              xstyle={styles.input}
            />
          </Stack>
          <Stack x xstyle={styles.row2}>
            {COLOR_OPTIONS.map((option) => (
              <Button
                variant="ghost"
                key={option.value}
                onClick={() =>
                  updateForm({
                    color: option.value,
                  })
                }
                style={{
                  backgroundColor: option.value,
                }}
                aria-label={`Select ${option.label} color`}
                aria-pressed={form.color === option.value}
                xstyle={[
                  styles.button,
                  [form.color === option.value && styles.button2],
                ]}
                title={option.label}
              />
            ))}
          </Stack>
          <Stack x xstyle={styles.row3}>
            {form.tags.map((tag, index) => (
              <span key={tag} {...stylex.props(styles.label)}>
                #{tag}
                <Button
                  variant="ghost"
                  xstyle={styles.button3}
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
          <Stack y divide={true} xstyle={styles.column2}>
            <MarkdownEditor
              value={form.content}
              mode="live"
              onChange={(content) =>
                updateForm({
                  content,
                })
              }
              placeholder="Event content..."
              xstyle={styles.icon4}
            />
            <Stack x xstyle={styles.row4}>
              <EventCard event={form} />
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
}
