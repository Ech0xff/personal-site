"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { toast } from "sonner";

import {
  fetchPostByBrowser,
  fetchSummaryByBrowser,
  savePostByBrowser,
} from "@/lib/client/services";
import type { Status, TagWithCount } from "@/types";

export type ViewMode = "edit" | "preview" | "split";

type PostFormState = {
  title: string;
  content: string;
  author: string;
  status: Status;
  published_at: string;
  tags: string[];
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
};

const DEFAULT_VIEW_MODE: ViewMode = "split";

export const useHooks = ({ id, onSaved, onClose }: UsePostEditorParams) => {
  const isNewMode = id === null;

  const [form, setForm] = useState<PostFormState>(DEFAULT_FORM);
  const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW_MODE);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<TagWithCount[]>([]);

  const updateForm = useCallback((patch: Partial<PostFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    const loadEditorData = async () => {
      try {
        const summary = await fetchSummaryByBrowser({
          tagSourceTypes: ["post"],
        });
        setTags(summary?.tags ?? []);

        if (isNewMode) {
          setForm(DEFAULT_FORM);
          setViewMode(DEFAULT_VIEW_MODE);
          return;
        }

        const post = await fetchPostByBrowser(id);
        if (post !== null) {
          setForm({
            ...DEFAULT_FORM,
            title: post.title,
            content: post.content,
            author: post.author,
            status: post.status,
            published_at: post.published_at,
            tags: post.tags.map((tag) => tag.name),
          });
        }
      } catch {
        toast.error("Failed to load post data");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    loadEditorData();
  }, [id, isNewMode, onClose]);

  const selectTag = useCallback((tag: string) => {
    setForm((prev) => {
      if (prev.tags.includes(tag)) return prev;
      return {
        ...prev,
        tags: [...prev.tags, tag],
      };
    });
  }, []);

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
    tags,
    updateForm,
    selectTag,
    removeTag,
    handleSubmit,
    viewMode,
    setViewMode,
    isPending,
    isLoading,
    pageTitle,
  };
};
