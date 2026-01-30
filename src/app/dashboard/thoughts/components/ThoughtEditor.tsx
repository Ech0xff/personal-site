"use client";

import { useEffect, useState, useTransition } from "react";

import { X } from "lucide-react";

import { BaseEditorProps } from "@/app/dashboard/components/EditorProvider";
import Button from "@/components/ui/Button";

import { getThought, saveThought } from "../actions";

export default function ThoughtEditor({
  id,
  onClose,
  onSaved,
}: BaseEditorProps) {
  const isNewMode = id === null;

  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(!isNewMode);
  const [errorMessage, setErrorMessage] = useState("");

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

  const addImage = () => {
    const url = imageInput.trim();
    if (url && !images.includes(url)) {
      setImages([...images, url]);
      setImageInput("");
    }
  };

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
          <div className="flex flex-wrap gap-2">
            {images.map((url, index) => (
              <div
                key={index}
                className="flex items-center gap-2 rounded bg-zinc-100 px-3 py-1.5 text-sm dark:bg-zinc-800"
              >
                <span className="max-w-50 truncate text-zinc-600 dark:text-zinc-400">
                  {url}
                </span>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="text-zinc-400 transition-colors hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addImage();
                  }
                }}
                type="text"
                placeholder="Add image URL..."
                className="w-48 rounded border border-zinc-200 bg-transparent px-3 py-1.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-blue-500 dark:border-zinc-700 dark:text-zinc-100"
              />
              <button
                type="button"
                onClick={addImage}
                className="rounded bg-zinc-100 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
