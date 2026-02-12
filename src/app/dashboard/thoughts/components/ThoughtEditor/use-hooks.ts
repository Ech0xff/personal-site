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

type ThoughtFormState = {
  content: string;
  images: string[];
  imageInput: string;
  status: Status;
};

type UseThoughtEditorParams = {
  id: string | null;
  onSaved: () => void;
  onClose: () => void;
};

const DEFAULT_FORM: ThoughtFormState = {
  content: "",
  images: [],
  imageInput: "",
  status: "hide",
};

export const useHooks = ({ id, onSaved, onClose }: UseThoughtEditorParams) => {
  const isNewMode = id === null;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ThoughtFormState>(DEFAULT_FORM);
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
            content: thought.content,
            images: thought.images || [],
            status: thought.status ?? "hide",
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

    startTransition(async () => {
      try {
        await saveThoughtByBrowser({
          id: id || undefined,
          content: form.content.trim(),
          images: form.images.length > 0 ? form.images : null,
          status: form.status,
        });

        onSaved();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save thought",
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
  };
};
