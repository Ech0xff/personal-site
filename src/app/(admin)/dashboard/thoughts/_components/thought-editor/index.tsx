import * as stylex from "@stylexjs/stylex";
import { Edit, Save, Upload, X } from "lucide-react";

import Button from "#components/ui/button.component";
import { MarkdownEditor } from "#components/ui/codemirror";
import DropdownPopover from "#components/ui/dropdown-popover.component";
import IconButton from "#components/ui/icon-button.component";
import Image from "#components/ui/image.component";
import SegmentedToggle from "#components/ui/segmented-toggle.component";
import Stack from "#components/ui/stack.component";
import { lightbox } from "#design/interaction.stylex";
import { color, space, shape, motionToken } from "#design/tokens.stylex";

import type { BaseEditorProps } from "../../../_components/editor.type";
import AuthorInput from "../../../_components/editor/author-input.component";
import DateTimeInput from "../../../_components/editor/date-time-input.component";
import HeaderSection from "../../../_components/editor/header-section.component";
import ThoughtCard from "../../../_components/features/thoughts/thought-card.component";
import { useThoughtEditor } from "./thought-editor.hook";
const styles = stylex.create({
  column7: {
    flexBasis: "50%",
  },
  thoughtCard2: {
    flexBasis: "50%",
  },
  column: {
    minHeight: "0px",
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
  button: {
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
  dateTimeInput: {
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
  column3: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "hidden",
  },
  column4: {
    overflowY: "auto",
  },
  column5: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
  },
  column6: {
    display: "none",
  },
  column8: {
    minHeight: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    gap: space.xs,
  },
  container2: {
    marginTop: "auto",
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(6, minmax(0, 1fr))",
      "@media (min-width: 768px)": "repeat(8, minmax(0, 1fr))",
      "@media (min-width: 1024px)": "repeat(10, minmax(0, 1fr))",
    },
    gap: space.xs,
  },
  icon3: {
    position: "absolute",
    top: space.xxs,
    right: space.xxs,
    height: "20px",
    width: "20px",
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
    opacity: {
      default: 0,
      [stylex.when.ancestor(":focus-within", lightbox)]: 1,
      [stylex.when.ancestor(":hover", lightbox)]: 1,
    },
    transitionProperty:
      "color, background-color, border-color, opacity, box-shadow, transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  icon4: {
    height: space.sm,
    width: space.sm,
  },
  thoughtCard: {
    overflowY: "auto",
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
  },
  layout1: {
    display: {
      default: "none",
      "@media (min-width: 768px)": "flex",
    },
  },
});
export default function ThoughtEditor({
  id,
  xstyle,
  onClose,
  onSaved,
}: BaseEditorProps) {
  const {
    form,
    viewMode,
    setViewMode,
    updateForm,
    fileInputRef,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
    isPending,
    isLoading,
    pageTitle,
    handleSubmit,
  } = useThoughtEditor({
    id,
    onSaved,
    onClose,
  });
  return (
    <Stack y xstyle={[styles.column, xstyle]}>
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
                <Stack x xstyle={styles.row}>
                  <Button
                    variant="ghost"
                    xstyle={styles.button}
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    disabled={isPending}
                  >
                    <Upload />
                  </Button>
                  <AuthorInput
                    value={form.author}
                    onChange={(value) =>
                      updateForm({
                        author: value,
                      })
                    }
                    disabled={isPending}
                  />
                </Stack>
                <Stack x xstyle={styles.row}>
                  <DateTimeInput
                    xstyle={styles.button}
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
            </Stack>
            <IconButton onClick={handleSubmit} aria-label="Save">
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
          <Stack y divide={true} xstyle={styles.column3}>
            {/* Main Editor Area */}
            <Stack
              y
              xstyle={[
                styles.column4,
                [
                  viewMode === "edit" && styles.column5,
                  viewMode === "preview" && styles.column6,
                  viewMode === "split" && styles.column7,
                ],
              ]}
            >
              {/* Content and Upload Button Row */}
              <Stack y xstyle={styles.column8}>
                <MarkdownEditor
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  value={form.content}
                  mode="live"
                  onChange={(content) =>
                    updateForm({
                      content,
                    })
                  }
                  placeholder="What's on your mind..."
                />
                {form.images.length > 0 && (
                  <div {...stylex.props(styles.container2)}>
                    {form.images.map((url, index) => (
                      <Image
                        key={url}
                        framed
                        src={url}
                        alt={`Image ${index + 1}`}
                        actionRender={() => (
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            xstyle={styles.icon3}
                            aria-label="Close"
                          >
                            <X {...stylex.props(styles.icon4)} />
                          </IconButton>
                        )}
                      />
                    ))}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    if (e.target.files) {
                      void handleFileUpload(e.target.files);
                      e.target.value = "";
                    }
                  }}
                  {...stylex.props(styles.column6)}
                />
              </Stack>
            </Stack>
            {/* Preview */}
            <ThoughtCard
              xstyle={[
                styles.thoughtCard,
                [
                  viewMode === "preview" && styles.column5,
                  viewMode === "edit" && styles.column6,
                  viewMode === "split" && styles.thoughtCard2,
                ],
              ]}
              thought={form}
            />
          </Stack>
        </>
      )}
    </Stack>
  );
}
