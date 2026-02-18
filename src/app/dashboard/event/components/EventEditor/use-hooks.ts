"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { toast } from "sonner";

import { fetchEventByBrowser, saveEventByBrowser } from "@/lib/client/services";
import { toDatetimeLocalValue } from "@/lib/shared/utils";
import { Status } from "@/types";

type EventFormState = {
  id: string;
  title: string;
  content: string;
  published_at: string;
  color: string;
  status: Status;
  tags: string[];
  tagInput: string;
};

type UseEventEditorParams = {
  id: string | null;
  onSaved: () => void;
  onClose: () => void;
};

const DEFAULT_FORM: EventFormState = {
  id: "",
  title: "",
  content: "",
  published_at: "",
  color: "blue",
  status: "hide",
  tags: [],
  tagInput: "",
};

export const useHooks = ({ id, onSaved, onClose }: UseEventEditorParams) => {
  const isNewMode = id === null;

  const [form, setForm] = useState<EventFormState>(DEFAULT_FORM);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);

  const updateForm = useCallback((patch: Partial<EventFormState>) => {
    setForm((prev) => ({ ...prev, ...patch }));
  }, []);

  useEffect(() => {
    if (isNewMode) {
      setForm(DEFAULT_FORM);
      setIsLoading(false);
      return;
    }

    const loadEvent = async () => {
      try {
        setIsLoading(true);
        const event = await fetchEventByBrowser(id);
        if (event) {
          setForm({
            ...DEFAULT_FORM,
            id: event.id,
            title: event.title,
            content: event.content,
            published_at: toDatetimeLocalValue(event.published_at),
            color: event.color,
            status: event.status,
            tags: event.tags,
          });
        }
      } catch {
        toast.error("Failed to load event data");
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    loadEvent();
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
      toast.error("Title is required");
      return;
    }
    if (!form.published_at) {
      toast.error("Please select publish time");
      return;
    }

    startTransition(async () => {
      try {
        await saveEventByBrowser({
          id: id || undefined,
          title: form.title.trim(),
          content: form.content.trim(),
          published_at: new Date(form.published_at).toISOString(),
          color: form.color,
          status: form.status,
          tags: form.tags.length > 0 ? form.tags : undefined,
        });

        onSaved();
      } catch {
        toast.error("Failed to save event");
      }
    });
  };

  const pageTitle = isNewMode ? "New Event" : "Edit Event";
  const submitButtonText = isPending
    ? "Saving..."
    : isNewMode
      ? "Create Event"
      : "Update Event";

  return {
    form,
    updateForm,
    addTag,
    removeTag,
    handleSubmit,
    isNewMode,
    isPending,
    isLoading,
    pageTitle,
    submitButtonText,
  };
};
