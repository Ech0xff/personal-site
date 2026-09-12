import { Edit, Save, Upload, X } from "lucide-react";

import ThoughtCard from "#components/features/thoughts/thought-card.component";
import Button from "#components/ui/button.component";
import { MarkdownEditor } from "#components/ui/codemirror";
import DropdownPopover from "#components/ui/dropdown-popover.component";
import IconButton from "#components/ui/icon-button.component";
import Image from "#components/ui/image.component";
import SegmentedToggle from "#components/ui/segmented-toggle.component";
import Stack from "#components/ui/stack.component";
import { cn } from "#lib/shared/utils";

import type { BaseEditorProps } from "../../../_components/editor.type";
import AuthorInput from "../../../_components/editor/author-input.component";
import DateTimeInput from "../../../_components/editor/date-time-input.component";
import HeaderSection from "../../../_components/editor/header-section.component";
import { useThoughtEditor } from "./thought-editor.hook";

export default function ThoughtEditor({
  id,
  className,
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
  } = useThoughtEditor({ id, onSaved, onClose });

  return (
    <Stack y className={cn("min-h-0 bg-surface-card", className)}>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-text-muted">
          Loading...
        </div>
      ) : (
        <>
          <HeaderSection title={pageTitle}>
            <DropdownPopover
              className="md:hidden"
              trigger={
                <IconButton aria-label="Edit">
                  <Edit className="h-6 w-6" />
                </IconButton>
              }
            >
              <Stack y className="gap-1">
                <Stack x className="w-full justify-between gap-1">
                  <Button
                    variant="ghost"
                    className="ml-3"
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
                    onChange={(value) => updateForm({ author: value })}
                    disabled={isPending}
                  />
                </Stack>
                <Stack x className="w-full justify-between gap-1">
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
                </Stack>
                <SegmentedToggle
                  value={viewMode}
                  onChange={setViewMode}
                  options={[
                    { value: "edit", label: "Edit" },
                    { value: "split", label: "Split" },
                    { value: "preview", label: "Preview" },
                  ]}
                />
              </Stack>
            </DropdownPopover>
            <Stack x className="hidden gap-2 md:flex">
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
                className="ml-auto"
                value={form.status}
                onChange={(value) => updateForm({ status: value })}
                options={[
                  { value: "hide", label: "Hide" },
                  { value: "show", label: "Show" },
                ]}
              />
              <DateTimeInput
                className="transition-transform duration-300 hover:scale-110"
                value={form.published_at}
                onChange={(value) => updateForm({ published_at: value })}
                disabled={isPending}
              />
            </Stack>
            <IconButton onClick={handleSubmit} aria-label="Save">
              <Save className="h-6 w-6" />
            </IconButton>
            <IconButton onClick={onClose} className="gap-1" aria-label="Close">
              <X className="h-8 w-8" />
            </IconButton>
          </HeaderSection>
          <Stack y divide={true} className="flex-1 overflow-hidden">
            {/* Main Editor Area */}
            <Stack
              y
              className={cn("overflow-y-auto", {
                "flex-1": viewMode === "edit",
                hidden: viewMode === "preview",
                "basis-1/2": viewMode === "split",
              })}
            >
              {/* Content and Upload Button Row */}
              <Stack y className="min-h-0 flex-1 gap-2">
                <MarkdownEditor
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  value={form.content}
                  mode="live"
                  onChange={(content) => updateForm({ content })}
                  placeholder="What's on your mind..."
                />
                {form.images.length > 0 && (
                  <div className="mt-auto grid grid-cols-6 gap-2 md:grid-cols-8 lg:grid-cols-10">
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
                            className="absolute top-1 right-1 h-5 w-5 rounded-full opacity-0 transition group-focus-within/lightbox:opacity-100 group-hover/lightbox:opacity-100"
                            aria-label="Close"
                          >
                            <X className="h-3 w-3" />
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
                  className="hidden"
                />
              </Stack>
            </Stack>
            {/* Preview */}
            <ThoughtCard
              className={cn("overflow-y-auto p-4", {
                "flex-1": viewMode === "preview",
                hidden: viewMode === "edit",
                "basis-1/2": viewMode === "split",
              })}
              thought={form}
            />
          </Stack>
        </>
      )}
    </Stack>
  );
}
