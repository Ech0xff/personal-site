"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { toast } from "sonner";

import {
  fetchThoughtByBrowser,
  isValidImageFile,
  saveThoughtByBrowser,
  uploadImageByBrowser,
} from "@/lib/client/services";
import { Status } from "@/types";

export type ViewMode = "edit" | "preview" | "split";
const DEFAULT_VIEW_MODE: ViewMode = "split";

type ThoughtFormState = {
  id: string;
  author: string;
  content: string;
  images: string[];
  imageInput: string;
  status: Status;
  published_at: string;
};

type UseThoughtEditorParams = {
  id: string | null;
  onSaved: () => Promise<void>;
  onClose: () => void;
};

const DEFAULT_FORM: ThoughtFormState = {
  id: "",
  author: "",
  content: "",
  images: [],
  imageInput: "",
  status: "show",
  published_at: "",
};

export const useHooks = ({ id, onSaved, onClose }: UseThoughtEditorParams) => {
  const isNewMode = id === null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ThoughtFormState>(DEFAULT_FORM);
  const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW_MODE);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const updateForm = useCallback((patch: Partial<ThoughtFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (isNewMode) {
      setForm(DEFAULT_FORM);
      setIsUploading(false);
      setIsDragging(false);
      setShowUrlInput(false);
      setIsLoading(false);
      return;
    }

    const loadThought = async () => {
      try {
        const thought = await fetchThoughtByBrowser(id);
        if (thought) {
          setForm({
            ...DEFAULT_FORM,
            id: thought.id,
            author: thought.author,
            content: thought.content,
            images: thought.images,
            status: thought.status,
            published_at: thought.published_at,
          });
        }
      } catch {
        toast.error("Failed to load thought data");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    loadThought();
  }, [id, isNewMode, onClose]);

  const handleFileUpload = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const validFiles = fileArray.filter(isValidImageFile);

      if (validFiles.length === 0) {
        toast.error("No valid image files selected");
        return;
      }

      setIsUploading(true);

      try {
        const uploadPromises = validFiles.map((file) =>
          uploadImageByBrowser(file),
        );
        const results = await Promise.all(uploadPromises);

        const newUrls = results
          .map((result) => result.url)
          .filter((url) => !form.images.includes(url));

        if (newUrls.length > 0) {
          setForm((prev) => ({
            ...prev,
            images: [...prev.images, ...newUrls],
          }));
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to upload images",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [form.images],
  );

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragging(false);

      const files = event.dataTransfer.files;
      if (files.length > 0) {
        handleFileUpload(files);
      }
    },
    [handleFileUpload],
  );

  const removeImage = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = () => {
    if (!form.content.trim()) {
      toast.error("Please enter content");
      return;
    }
    if (!form.published_at) {
      toast.error("Please select publish time");
      return;
    }

    startTransition(async () => {
      const toastId = toast.loading(
        isNewMode ? "Creating thought..." : "Updating thought...",
      );
      try {
        await saveThoughtByBrowser({
          id: id || undefined,
          author: form.author,
          content: form.content,
          images: form.images,
          status: form.status,
          published_at: form.published_at,
        });

        await onSaved();
        toast.success(isNewMode ? "Thought created" : "Thought updated", {
          id: toastId,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save thought",
          { id: toastId },
        );
      }
    });
  };

  const pageTitle = isNewMode ? "New Thought" : "Edit Thought";
  const submitButtonText = isPending
    ? "Saving..."
    : isNewMode
      ? "Create Thought"
      : "Update Thought";

  return {
    form,
    viewMode,
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
    setViewMode,
    pageTitle,
    submitButtonText,
    handleSubmit,
  };
};
