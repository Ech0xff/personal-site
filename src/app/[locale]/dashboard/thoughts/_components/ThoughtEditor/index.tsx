"use client";

import { Edit, Save, Upload, X } from "lucide-react";

import ThoughtCard from "@/components/features/thoughts/ThoughtCard";
import DropdownPopover from "@/components/ui/DropdownPopover";
import Image from "@/components/ui/Image";
import Stack from "@/components/ui/Stack";
import { useCurrentLocale } from "@/lib/client/locale";
import { cn } from "@/lib/shared/utils";
import type { Status } from "@/types";

import type { BaseEditorProps } from "../../../_components/EditorProvider";
import AuthorInput from "../../../_components/ui/AuthorInput";
import DateTimeInput from "../../../_components/ui/DateTimeInput";
import HeaderSection from "../../../_components/ui/HeaderSection";
import SegmentedToggle from "../../../_components/ui/SegmentedToggle";
import { useHooks } from "./use-hooks";

export { default as OpenButton } from "./OpenButton";
export default function ThoughtEditor({
  id,
  className,
  onClose,
  onSaved,
}: BaseEditorProps) {
  const locale = useCurrentLocale();
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
  } = useHooks({ id, onSaved, onClose });

  return (
    <Stack y className={cn("min- bg-white dark:bg-zinc-900", className)}>
      {isLoading ? (
        <div className="flex flex-1 items-center justify-center text-zinc-500">
          Loading...
        </div>
      ) : (
        <>
          <HeaderSection title={pageTitle}>
            <DropdownPopover
              className="md:hidden"
              trigger={
                <button type="button" className="duration-300 hover:scale-110">
                  <Edit className="h-6 w-6" />
                </button>
              }
            >
              <Stack y className="gap-1">
                <Stack x className="w-full justify-between gap-1">
                  <button
                    type="button"
                    className="ml-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    disabled={isPending}
                  >
                    <Upload />
                  </button>
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
                    onChange={(value) =>
                      updateForm({ status: value as Status })
                    }
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
                onChange={(value) => updateForm({ status: value as Status })}
                options={[
                  { value: "hide", label: "Hide" },
                  { value: "show", label: "Show" },
                ]}
              />

              <DateTimeInput
                className="duration-300 hover:scale-110"
                value={form.published_at}
                onChange={(value) => updateForm({ published_at: value })}
                disabled={isPending}
              />
            </Stack>
            <button
              type="button"
              onClick={handleSubmit}
              className="duration-300 hover:scale-110"
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
          <Stack y divide={true} className="flex-1 overflow-hidden *:p-4">
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
              <Stack y className="flex-1 gap-2">
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
                      <Image
                        key={index}
                        framed
                        src={url}
                        alt={`Image ${index + 1}`}
                        actionRender={() => (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-all hover:bg-red-600 group-hover/lightbox:opacity-100"
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
              </Stack>
            </Stack>

            {/* Preview */}
            <ThoughtCard
              className={cn("overflow-y-auto", {
                "flex-1": viewMode === "preview",
                hidden: viewMode === "edit",
                "basis-1/2": viewMode === "split",
              })}
              locale={locale}
              thought={form}
            />
          </Stack>
        </>
      )}
    </Stack>
  );
}
