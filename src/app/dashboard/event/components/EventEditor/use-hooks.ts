"use client";

import { useCallback, useEffect, useState, useTransition } from "react";

import { toast } from "sonner";

import { fetchEventByBrowser, saveEventByBrowser } from "@/lib/client/services";
import { Status } from "@/types";

type EventFormState = {
  title: string;
  description: string;
  eventDate: string;
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
  title: "",
  description: "",
  eventDate: "",
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
        const event = await fetchEventByBrowser(id);
        if (event) {
          setForm({
            ...DEFAULT_FORM,
            title: event.title,
            description: event.description || "",
            eventDate: event.event_date,
            color: event.color || "blue",
            status: event.status ?? "hide",
            tags: event.tags || [],
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
    if (!form.eventDate) {
      toast.error("Please select a date");
      return;
    }

    startTransition(async () => {
      try {
        await saveEventByBrowser({
          id: id || undefined,
          title: form.title.trim(),
          description: form.description.trim() || null,
          event_date: form.eventDate,
          color: form.color,
          status: form.status,
          tags: form.tags.length > 0 ? form.tags : null,
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
