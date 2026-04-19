"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { toast } from "sonner";

import {
  fetchEventByBrowser,
  fetchSummaryByBrowser,
  saveEventByBrowser,
} from "@/lib/client/services";
import type { Status, TagWithCount } from "@/types";

type EventFormState = {
  id: string;
  title: string;
  content: string;
  published_at: string;
  color: string;
  status: Status;
  tags: string[];
};

type UseEventEditorParams = {
  id: string | null;
  onSaved: () => Promise<void>;
  onClose: () => void;
};

const DEFAULT_FORM: EventFormState = {
  id: "",
  title: "",
  content: "",
  published_at: "",
  color: "blue",
  status: "show",
  tags: [],
};

export const useHooks = ({ id, onSaved, onClose }: UseEventEditorParams) => {
  const isNewMode = id === null;

  const [form, setForm] = useState<EventFormState>(DEFAULT_FORM);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [tags, setTags] = useState<TagWithCount[]>([]);

  const updateForm = useCallback((patch: Partial<EventFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    const loadEditorData = async () => {
      try {
        const summary = await fetchSummaryByBrowser({
          tagSourceTypes: ["event"],
        });
        setTags(summary?.tags ?? []);

        if (isNewMode) {
          setForm(DEFAULT_FORM);
          return;
        }

        const event = await fetchEventByBrowser(id);
        if (event) {
          setForm({
            ...DEFAULT_FORM,
            id: event.id,
            title: event.title,
            content: event.content,
            published_at: event.published_at,
            color: event.color,
            status: event.status,
            tags: event.tags.map((tag) => tag.name),
          });
        }
      } catch {
        toast.error("Failed to load event data");
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
      toast.error("Title is required");
      return;
    }
    if (!form.published_at) {
      toast.error("Please select publish time");
      return;
    }

    startTransition(async () => {
      const toastId = toast.loading(
        isNewMode ? "Creating event..." : "Updating event...",
      );
      try {
        const tagIds = tags
          .filter((tag) => form.tags.includes(tag.name))
          .map((tag) => tag.id);

        await saveEventByBrowser({
          id: id || undefined,
          title: form.title.trim(),
          content: form.content.trim(),
          published_at: form.published_at,
          color: form.color,
          status: form.status,
          tagIds,
        });

        await onSaved();
        toast.success(isNewMode ? "Event created" : "Event updated", {
          id: toastId,
        });
      } catch {
        toast.error("Failed to save event", { id: toastId });
      }
    });
  };

  const pageTitle = isNewMode ? "New Event" : "Edit Event";
  return {
    form,
    tags,
    updateForm,
    selectTag,
    removeTag,
    handleSubmit,
    isNewMode,
    isPending,
    isLoading,
    pageTitle,
  };
};
