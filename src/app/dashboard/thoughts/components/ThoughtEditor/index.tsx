"use client";

import { Upload, X } from "lucide-react";

import { BaseEditorProps } from "@/app/dashboard/components/EditorProvider";
import DateTimeInput from "@/app/dashboard/components/ui/DateTimeInput";
import SegmentedToggle from "@/app/dashboard/components/ui/SegmentedToggle";
import ThoughtCard from "@/components/features/thoughts/ThoughtCard";
import Button from "@/components/ui/Button";
import LightboxImage from "@/components/ui/Image";
import StackX from "@/components/ui/StackX";
import StackY from "@/components/ui/StackY";
import { cn } from "@/lib/shared/utils";
import { Status } from "@/types";

import { useHooks } from "./use-hooks";

export { default as OpenButton } from "./OpenButton";
export default function ThoughtEditor({
  id,
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
    submitButtonText,
    handleSubmit,
  } = useHooks({ id, onSaved, onClose });

  if (isLoading) {
    return (
      <StackX className="absolute inset-0 z-50 items-center justify-center bg-white dark:bg-zinc-900">
        <div className="text-zinc-500">Loading...</div>
      </StackX>
    );
  }

  return (
    <StackY className="absolute inset-0 z-50 bg-white dark:bg-zinc-900">
      {/* Top Toolbar */}
      <StackX className="shrink-0 items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
        <StackX className="items-center gap-4">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            {pageTitle}
          </h1>
        </StackX>

        <StackX className="ml-auto items-center gap-3">
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
          <Button
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={isPending}
          >
            <Upload className="h-4 w-4" />
            Browse Files
          </Button>
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
      <StackY divided={true} className="flex-1 overflow-hidden *:p-4">
        {/* Main Editor Area */}
        <StackY
          className={cn("overflow-y-auto", {
            "flex-1": viewMode === "edit",
            hidden: viewMode === "preview",
            "basis-1/2": viewMode === "split",
          })}
        >
          {/* Content and Upload Button Row */}
          <StackY className="flex-1 gap-2">
            <textarea
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              value={form.content}
              onChange={(e) => updateForm({ content: e.target.value })}
              placeholder="What's on your mind..."
              className="h-full w-full resize-none rounded-lg bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400 dark:border-zinc-700 dark:text-zinc-100"
            />
            {form.images.length > 0 && (
              <div className="mt-auto grid grid-cols-6 gap-2 md:grid-cols-8 lg:grid-cols-10">
                {form.images.map((url, index) => (
                  <LightboxImage
                    key={index}
                    src={url}
                    alt={`Image ${index + 1}`}
                    actionRender={() => (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-all group-hover/lightbox:opacity-100 hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
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
                  handleFileUpload(e.target.files);
                  e.target.value = "";
                }
              }}
              className="hidden"
            />
          </StackY>
        </StackY>

        {/* Preview */}
        <ThoughtCard
          className={cn("overflow-y-auto", {
            "flex-1": viewMode === "preview",
            hidden: viewMode === "edit",
            "basis-1/2": viewMode === "split",
          })}
          thought={{
            ...form,
            published_at: form.publishedAt,
          }}
        />
      </StackY>
    </StackY>
  );
}
