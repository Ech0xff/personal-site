"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { toast } from "sonner";

import { fetchPostByBrowser, savePostByBrowser } from "@/lib/client/services";
import { Status } from "@/types";

export type ViewMode = "edit" | "preview" | "split";

type PostFormState = {
  title: string;
  content: string;
  author: string;
  status: Status;
  published_at: string;
  tags: string[];
  tagInput: string;
};

type UsePostEditorParams = {
  id: string | null;
  onSaved: () => Promise<void>;
  onClose: () => void;
};

const DEFAULT_FORM: PostFormState = {
  title: "",
  content: "",
  author: "",
  status: "show",
  published_at: "",
  tags: [],
  tagInput: "",
};

const DEFAULT_VIEW_MODE: ViewMode = "split";

export const useHooks = ({ id, onSaved, onClose }: UsePostEditorParams) => {
  const isNewMode = id === null;

  const [form, setForm] = useState<PostFormState>(DEFAULT_FORM);
  const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW_MODE);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const updateForm = useCallback((patch: Partial<PostFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (isNewMode) {
      setForm(DEFAULT_FORM);
      setViewMode(DEFAULT_VIEW_MODE);
      setIsLoading(false);
      return;
    }

    const loadPost = async () => {
      try {
        const post = await fetchPostByBrowser(id);
        if (post) {
          setForm({
            ...DEFAULT_FORM,
            title: post.title,
            content: post.content,
            author: post.author,
            status: post.status,
            published_at: post.published_at,
            tags: post.tags ?? [],
          });
        }
      } catch {
        toast.error("Failed to load post data");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [id, isNewMode, onClose]);

  const addTag = useCallback(() => {
    const tag = form.tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      setForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
        tagInput: "",
      }));
    }
  }, [form.tagInput, form.tags]);

  const removeTag = useCallback((index: number) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
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
        isNewMode ? "Creating post..." : "Updating post...",
      );
      try {
        await savePostByBrowser({
          id: id || undefined,
          title: form.title.trim(),
          content: form.content.trim(),
          author: form.author.trim(),
          status: form.status,
          published_at: form.published_at,
          tags: form.tags.length > 0 ? form.tags : null,
        });

        await onSaved();
        toast.success(isNewMode ? "Post created" : "Post updated", {
          id: toastId,
        });
      } catch {
        toast.error("Failed to save post", { id: toastId });
      }
    });
  };

  const pageTitle = isNewMode ? "New Post" : "Edit Post";
  return {
    form,
    updateForm,
    addTag,
    removeTag,
    handleSubmit,
    viewMode,
    setViewMode,
    isPending,
    isLoading,
    pageTitle,
  };
};
