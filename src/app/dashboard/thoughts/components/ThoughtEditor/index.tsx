"use client";

import { Upload, X } from "lucide-react";

import { BaseEditorProps } from "@/app/dashboard/components/EditorProvider";
import DateTimeInput from "@/app/dashboard/components/ui/DateTimeInput";
import SegmentedToggle from "@/app/dashboard/components/ui/SegmentedToggle";
import Button from "@/components/ui/Button";
import LightboxImage from "@/components/ui/Image";
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
    updateForm,
    fileInputRef,
    handleFileUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
    isPending,
    isLoading,
    isUploading,
    isDragging,
    showUrlInput,
    setShowUrlInput,
    pageTitle,
    submitButtonText,
    handleSubmit,
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

        <div className="ml-auto flex items-center gap-3">
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
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
        <DateTimeInput
          value={form.publishedAt}
          onChange={(value) => updateForm({ publishedAt: value })}
          wrapperClassName="flex items-center gap-3"
          labelClassName="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          inputClassName="rounded border border-zinc-200 bg-transparent px-2 py-1 text-sm text-zinc-900 outline-none focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
        />

        {/* Content and Upload Button Row */}
        <div className="grid grid-cols-4 gap-4">
          {/* Content - Left Half */}
          <div className="col-span-3 flex grid-cols-3 flex-col">
            <label className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Content
            </label>
            <textarea
              value={form.content}
              onChange={(e) => updateForm({ content: e.target.value })}
              placeholder="What's on your mind..."
              className="h-64 resize-none rounded-lg border border-zinc-200 bg-transparent p-4 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
            />
          </div>

          {/* Upload Button - Right Half */}
          <div className="flex flex-col">
            <label className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Add Images
            </label>

            {/* Hidden file input */}
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

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative h-64 w-full ${
                isDragging
                  ? "rounded-lg bg-blue-50 p-2 dark:bg-blue-900/20"
                  : ""
              }`}
            >
              <div
                onClick={() => setShowUrlInput(!showUrlInput)}
                className="group flex h-full w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 transition-all hover:border-blue-500 hover:bg-blue-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-blue-500 dark:hover:bg-blue-900/20"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-500" />
                    <span className="text-sm text-zinc-500">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      {/* Browse Files Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                          setShowUrlInput(false);
                        }}
                        className="flex w-full items-center gap-2 rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                      >
                        <Upload className="h-4 w-4" />
                        Browse Files
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Images Grid - Full Width Below */}
        {form.images.length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Uploaded Images ({form.images.length})
            </label>
            <div className="grid grid-cols-6 gap-2 md:grid-cols-8 lg:grid-cols-10">
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
          </div>
        )}
      </div>
    </div>
  );
}
