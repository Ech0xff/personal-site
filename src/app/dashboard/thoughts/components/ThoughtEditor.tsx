"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { ImagePlus, Link as LinkIcon, Upload, X } from "lucide-react";

import { BaseEditorProps } from "@/app/dashboard/components/EditorProvider";
import Button from "@/components/ui/Button";
import {
  isValidImageFile,
  isValidImageUrl,
  uploadImage,
  uploadImageFromUrl,
} from "@/lib/upload";

import { getThought, saveThought } from "../actions";

export default function ThoughtEditor({
  id,
  onClose,
  onSaved,
}: BaseEditorProps) {
  const isNewMode = id === null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(!isNewMode);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Form state
  const [content, setContent] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");

  // Load thought data for edit mode
  useEffect(() => {
    if (isNewMode) return;

    const loadThought = async () => {
      setIsLoading(true);
      const thought = await getThought(id);
      if (thought) {
        setContent(thought.content);
        setImages(thought.images || []);
      } else {
        setErrorMessage("Failed to load thought");
      }
      setIsLoading(false);
    };

    loadThought();
  }, [id, isNewMode]);

  // Handle file upload
  const handleFileUpload = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(isValidImageFile);

      if (validFiles.length === 0) {
        setErrorMessage("No valid image files selected");
        return;
      }

      setIsUploading(true);
      setErrorMessage("");

      try {
        const uploadPromises = validFiles.map((file) => uploadImage(file));
        const results = await Promise.all(uploadPromises);

        const newUrls = results
          .map((r) => r.url)
          .filter((url) => !images.includes(url));

        if (newUrls.length > 0) {
          setImages((prev) => [...prev, ...newUrls]);
        }
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to upload images",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [images],
  );

  // Handle URL upload
  const handleUrlUpload = async () => {
    const url = imageInput.trim();
    if (!url) return;

    if (!isValidImageUrl(url)) {
      setErrorMessage("Invalid image URL");
      return;
    }

    // Prevent duplicate images
    if (images.includes(url)) {
      setImageInput("");
      setShowUrlInput(false);
      return;
    }

    setIsUploading(true);
    setErrorMessage("");

    try {
      const result = await uploadImageFromUrl(url);
      if (!images.includes(result.url)) {
        setImages((prev) => [...prev, result.url]);
      }
      setImageInput("");
      setShowUrlInput(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to upload from URL",
      );
    } finally {
      setIsUploading(false);
    }
  };

  // Handle drag events
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
      }
    },
    [handleFileUpload],
  );

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      setErrorMessage("Please enter content");
      return;
    }

    setErrorMessage("");

    startTransition(async () => {
      const result = await saveThought({
        id: id || undefined,
        content: content.trim(),
        images: images.length > 0 ? images : null,
      });

      if (result.success) {
        onSaved();
      } else {
        setErrorMessage(result.error || "Failed to save thought");
      }
    });
  };

  const pageTitle = isNewMode ? "New Thought" : "Edit Thought";
  const submitButtonText = isPending
    ? "Saving..."
    : isNewMode
      ? "Create Thought"
      : "Update Thought";

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

        <Button
          onClick={handleSubmit}
          className="mr-3 ml-auto"
          disabled={isPending}
        >
          {submitButtonText}
        </Button>

        <button
          onClick={onClose}
          className="flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <X className="h-8 w-8" />
        </button>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="shrink-0 border-b border-red-200 bg-red-50 px-6 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
          {errorMessage}
        </div>
      )}

      {/* Main Editor Area */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 p-6">
        {/* Content */}
        <div className="flex flex-1 flex-col">
          <label className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind..."
            className="flex-1 resize-none rounded-lg border border-zinc-200 bg-transparent p-4 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
          />
        </div>

        {/* Images */}
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Images (optional)
          </label>

          {/* Drag and drop upload area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative mb-3 rounded-lg border-2 border-dashed p-4 transition-colors ${
              isDragging
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-zinc-300 dark:border-zinc-700"
            }`}
          >
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

            <div className="flex flex-col items-center gap-2 text-center">
              {isUploading ? (
                <div className="flex items-center gap-2 text-zinc-500">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-blue-500" />
                  <span>Uploading...</span>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-zinc-400" />
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Drag and drop images here, or
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
                    >
                      <ImagePlus className="h-4 w-4" />
                      Browse Files
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUrlInput(!showUrlInput)}
                      className="inline-flex items-center gap-1.5 rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                    >
                      <LinkIcon className="h-4 w-4" />
                      Add from URL
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* URL Input */}
            {showUrlInput && (
              <div className="mt-3 flex gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-700">
                <input
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleUrlUpload();
                    }
                    if (e.key === "Escape") {
                      setShowUrlInput(false);
                      setImageInput("");
                    }
                  }}
                  type="text"
                  placeholder="Paste image URL here..."
                  className="flex-1 rounded border border-zinc-200 bg-transparent px-3 py-1.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleUrlUpload}
                  disabled={isUploading || !imageInput.trim()}
                  className="rounded bg-blue-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowUrlInput(false);
                    setImageInput("");
                  }}
                  className="rounded bg-zinc-100 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Image Preview */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {images.map((url, index) => (
                <div
                  key={index}
                  className="group relative h-24 w-24 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
