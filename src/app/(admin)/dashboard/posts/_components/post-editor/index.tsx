import * as stylex from "@stylexjs/stylex";
import { Edit, Eye, Save, X } from "lucide-react";

import Button from "#components/ui/button.component";
import { MarkdownEditor } from "#components/ui/codemirror";
import DropdownPopover from "#components/ui/dropdown-popover.component";
import IconButton from "#components/ui/icon-button.component";
import Input from "#components/ui/input.component";
import SegmentedToggle from "#components/ui/segmented-toggle.component";
import Stack from "#components/ui/stack.component";
import { color, font, space, shape, motionToken } from "#design/tokens.stylex";

import type { BaseEditorProps } from "../../../_components/editor.type";
import AuthorInput from "../../../_components/editor/author-input.component";
import DateTimeInput from "../../../_components/editor/date-time-input.component";
import HeaderSection from "../../../_components/editor/header-section.component";
import { PostContent } from "../../../_components/features/content";
import TagSelector from "../../../_components/tags/tag-selector.component";
import { usePostEditor } from "./post-editor.hook";
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
  dropdownPopover: {
    display: {
      default: null,
      "@media (min-width: 768px)": "none",
    },
  },
  icon: {
    height: space.lg,
    width: space.lg,
  },
  column2: {
    gap: space.xxs,
  },
  row: {
    width: "100%",
    justifyContent: "space-between",
    gap: space.xxs,
  },
  dateTimeInput: {
    marginLeft: space.sm,
  },
  segmentedToggle: {
    marginLeft: "auto",
  },
  row2: {
    display: {
      default: "none",
      "@media (min-width: 768px)": "flex",
    },
    gap: space.xs,
  },
  dateTimeInput2: {
    transitionDuration: motionToken.fast,
    scale: {
      default: null,
      ":hover": 1.1,
    },
  },
  icon2: {
    height: space.xl,
    width: space.xl,
  },
  row3: {
    minHeight: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    flexDirection: {
      default: "column",
      "@media (min-width: 768px)": "row",
    },
    gap: "0px",
    overflow: "auto",
  },
  column3: {
    overflow: "hidden",
  },
  column4: {
    display: "none",
  },
  column5: {
    height: {
      default: "50%",
      "@media (min-width: 768px)": "auto",
    },
    minHeight: {
      default: "256px",
      "@media (min-width: 768px)": "0px",
    },
    width: {
      default: "100%",
      "@media (min-width: 768px)": "50%",
    },
    flexShrink: 0,
  },
  column6: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
  },
  column7: {
    flexShrink: 0,
    gap: space.sm,
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
  },
  input: {
    width: "100%",
    borderTopStyle: "none",
    borderRightStyle: "none",
    borderBottomStyle: "none",
    borderLeftStyle: "none",
    backgroundColor: "transparent",
    paddingLeft: "0px",
    paddingRight: "0px",
    fontSize: font.large,
    lineHeight: 1.5,
    fontWeight: font.semibold,
  },
  row4: {
    flexWrap: "wrap",
    alignItems: "center",
    gap: space.md,
  },
  row5: {
    minWidth: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    flexWrap: "wrap",
    alignItems: "center",
    gap: space.xs,
  },
  label: {
    flexShrink: 0,
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.muted,
  },
  row6: {
    minWidth: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    flexWrap: "wrap",
    alignItems: "center",
    gap: space.xxs,
  },
  label2: {
    display: "flex",
    flexShrink: 0,
    alignItems: "center",
    gap: space.xxs,
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    backgroundColor: color.surfaceMuted,
    paddingLeft: space.xs,
    paddingRight: space.xs,
    paddingTop: "2px",
    paddingBottom: "2px",
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.secondary,
  },
  button: {
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
  icon3: {
    minHeight: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
  },
  column8: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transitionProperty:
      "color, background-color, border-color, opacity, box-shadow, transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  row7: {
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
    alignItems: "center",
    gap: space.xs,
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.muted,
  },
  icon4: {
    height: space.md,
    width: space.md,
  },
  container2: {
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
    minHeight: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "auto",
  },
  heading: {
    marginBottom: space.md,
    fontSize: font.subtitle,
    lineHeight: 1.5,
    fontWeight: font.bold,
    color: color.text,
  },
  heading2: {
    marginBottom: space.md,
    fontSize: font.subtitle,
    lineHeight: 1.5,
    color: color.muted,
    fontStyle: "italic",
  },
  row8: {
    marginBottom: space.lg,
    alignItems: "center",
    gap: space.sm,
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.muted,
  },
  row9: {
    alignItems: "center",
    gap: space.xxs,
  },
  label3: {
    color: color.infoText,
  },
  description: {
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.muted,
    fontStyle: "italic",
  },
  layout1: {
    display: {
      default: "none",
      "@media (min-width: 768px)": "flex",
    },
  },
  layout2: {
    flexDirection: {
      default: "column",
      "@media (min-width: 768px)": "row",
    },
  },
});
export default function PostEditor({
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
    viewMode,
    setViewMode,
    isPending,
    isLoading,
    pageTitle,
  } = usePostEditor({
    id,
    onSaved,
    onClose,
  });
  return (
    <Stack y divide xstyle={[styles.column, xstyle]}>
      {/* Top Toolbar */}
      {isLoading ? (
        <div {...stylex.props(styles.container)}>Loading...</div>
      ) : (
        <>
          <HeaderSection title={pageTitle}>
            <DropdownPopover
              xstyle={styles.dropdownPopover}
              trigger={
                <IconButton aria-label="Edit">
                  <Edit {...stylex.props(styles.icon)} />
                </IconButton>
              }
            >
              <Stack y xstyle={styles.column2}>
                <AuthorInput
                  value={form.author}
                  onChange={(value) =>
                    updateForm({
                      author: value,
                    })
                  }
                  disabled={isPending}
                />
                <Stack x xstyle={styles.row}>
                  <DateTimeInput
                    xstyle={styles.dateTimeInput}
                    value={form.published_at}
                    onChange={(value) =>
                      updateForm({
                        published_at: value,
                      })
                    }
                    disabled={isPending}
                  />
                  <SegmentedToggle
                    xstyle={styles.segmentedToggle}
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
                </Stack>
                <SegmentedToggle
                  value={viewMode}
                  onChange={setViewMode}
                  options={[
                    {
                      value: "edit",
                      label: "Edit",
                    },
                    {
                      value: "split",
                      label: "Split",
                    },
                    {
                      value: "preview",
                      label: "Preview",
                    },
                  ]}
                />
              </Stack>
            </DropdownPopover>
            <Stack x xstyle={[styles.row2, styles.layout1]}>
              <AuthorInput
                value={form.author}
                onChange={(value) =>
                  updateForm({
                    author: value,
                  })
                }
                disabled={isPending}
              />
              <SegmentedToggle
                value={viewMode}
                onChange={setViewMode}
                options={[
                  {
                    value: "edit",
                    label: "Edit",
                  },
                  {
                    value: "split",
                    label: "Split",
                  },
                  {
                    value: "preview",
                    label: "Preview",
                  },
                ]}
              />
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
                xstyle={styles.dateTimeInput2}
                value={form.published_at}
                onChange={(value) =>
                  updateForm({
                    published_at: value,
                  })
                }
                disabled={isPending}
              />
            </Stack>
            {/* Save Button */}
            <IconButton
              onClick={handleSubmit}
              loading={isPending}
              aria-label="Save"
            >
              <Save {...stylex.props(styles.icon)} />
            </IconButton>
            <IconButton
              onClick={onClose}
              xstyle={styles.column2}
              aria-label="Close"
            >
              <X {...stylex.props(styles.icon2)} />
            </IconButton>
          </HeaderSection>
          {/* Main Editor Area */}
          <Stack x divide={true} xstyle={[styles.row3, styles.layout2]}>
            {/* Left: Editor Panel */}
            <Stack
              y
              divide={true}
              xstyle={[
                styles.column3,
                viewMode === "preview"
                  ? styles.column4
                  : viewMode === "split"
                    ? styles.column5
                    : styles.column6,
                null,
              ]}
            >
              {/* Editor Header */}
              <Stack y xstyle={styles.column7}>
                {/* Title Input */}
                <Input
                  value={form.title}
                  onChange={(e) =>
                    updateForm({
                      title: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="Enter post title..."
                  xstyle={styles.input}
                />
                {/* Tags */}
                <Stack x xstyle={styles.row4}>
                  <Stack x xstyle={styles.row5}>
                    <span {...stylex.props(styles.label)}>Tags:</span>
                    <Stack x xstyle={styles.row6}>
                      {form.tags.map((tag, index) => (
                        <span key={tag} {...stylex.props(styles.label2)}>
                          #{tag}
                          <Button
                            variant="ghost"
                            xstyle={styles.button}
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
                        onSelect={(tagId: string) => {
                          const tag = tags.find((item) => item.id === tagId);
                          if (tag) selectTag(tag.name);
                        }}
                        onDeselect={deselectTag}
                        selectedTags={form.tags}
                      />
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>
              {/* Content Editor */}
              <MarkdownEditor
                value={form.content}
                mode="live"
                onChange={(content) =>
                  updateForm({
                    content,
                  })
                }
                xstyle={styles.icon3}
                placeholder="Write your post content using Markdown..."
              />
            </Stack>
            {/* Right: Preview Panel */}
            <Stack
              y
              divide={true}
              xstyle={[
                styles.column8,
                viewMode === "edit"
                  ? styles.column4
                  : viewMode === "split"
                    ? styles.column5
                    : styles.column6,
                null,
              ]}
            >
              {/* Preview Header */}
              <Stack x xstyle={styles.row7}>
                <Eye {...stylex.props(styles.icon4)} />
                Preview
              </Stack>
              {/* Preview Content */}
              <div {...stylex.props(styles.container2)}>
                {/* Preview Title */}
                {form.title ? (
                  <h1 {...stylex.props(styles.heading)}>{form.title}</h1>
                ) : (
                  <h1 {...stylex.props(styles.heading2)}>Untitled</h1>
                )}
                {/* Preview Meta */}
                {(form.author || form.tags.length > 0) && (
                  <Stack x xstyle={styles.row8}>
                    {form.author && <span>{form.author}</span>}
                    {form.tags.length > 0 && (
                      <Stack x xstyle={styles.row9}>
                        {form.tags.map((tag) => (
                          <span key={tag} {...stylex.props(styles.label3)}>
                            #{tag}
                          </span>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                )}
                {/* Markdown Content Preview */}
                {form.content ? (
                  <PostContent content={form.content} />
                ) : (
                  <p {...stylex.props(styles.description)}>
                    Start writing and the preview will appear here...
                  </p>
                )}
              </div>
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
}
