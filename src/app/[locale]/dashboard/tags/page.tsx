"use client";

import { Plus, Save, Tags, X } from "lucide-react";
import { useState } from "react";

import TagSphere from "@/components/features/tags/TagSphere";
import Stack from "@/components/ui/Stack";
import type { Json, TagWithCount } from "@/types";

import DashboardShell from "../_components/ui/DashboardShell";
import { useHooks } from "./use-hooks";

type TagForm = {
  id?: string;
  meta: string;
  name: string;
};

type JsonObject = { [key: string]: Json | undefined };

export default function TagsPage() {
  const {
    tags: displayTags,
    loading,
    error,
    createTag,
    updateTag,
  } = useHooks();
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [tagForm, setTagForm] = useState<TagForm | null>(null);
  const isEditing = Boolean(tagForm?.id);

  const openCreateModal = () => {
    setFormError("");
    setTagForm({
      meta: "{}",
      name: "",
    });
  };

  const openEditModal = (tag: TagWithCount) => {
    setFormError("");
    setTagForm({
      id: tag.id,
      meta: JSON.stringify(tag.meta, null, 2),
      name: tag.name,
    });
  };

  const closeModal = () => {
    setFormError("");
    setTagForm(null);
  };

  const saveTag = async () => {
    if (!tagForm) return;

    const name = tagForm.name.trim();
    if (!name) {
      setFormError("Name is required.");
      return;
    }

    let meta: JsonObject;
    try {
      const parsedMeta = JSON.parse(tagForm.meta || "{}");
      if (
        parsedMeta === null ||
        Array.isArray(parsedMeta) ||
        typeof parsedMeta !== "object"
      ) {
        setFormError("Meta must be a JSON object.");
        return;
      }
      meta = parsedMeta as JsonObject;
    } catch {
      setFormError("Meta is not valid JSON.");
      return;
    }

    setSaving(true);
    try {
      if (tagForm.id) {
        await updateTag({
          id: tagForm.id,
          meta,
          name,
        });
      } else {
        await createTag({
          meta,
          name,
        });
      }
      closeModal();
    } catch {
      setFormError("Save failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell title="Tags" loading={loading} error={error}>
      <Stack y className="flex-1 gap-4">
        <Stack
          x
          className="items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
        >
          <Stack x className="items-center gap-2">
            <Tags className="h-4 w-4" />
            <span>
              {displayTags.length} tag{displayTags.length !== 1 ? "s" : ""}
            </span>
          </Stack>
          <button
            type="button"
            onClick={openCreateModal}
            disabled={saving}
            className="inline-flex items-center gap-1 rounded border border-zinc-200 px-2 py-1 font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
          >
            <Plus className="h-4 w-4" />
            Add tag
          </button>
        </Stack>
        <div className="grid flex-1 place-items-center overflow-hidden">
          <TagSphere
            className="aspect-square h-full"
            onTagClick={openEditModal}
            tags={displayTags}
          />
        </div>
      </Stack>

      {tagForm ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-zinc-950/40 px-4 backdrop-blur-sm">
          <Stack
            y
            className="w-full max-w-md gap-4 rounded-lg border border-zinc-200 bg-white p-5 shadow-xl dark:border-zinc-800 dark:bg-zinc-950"
            role="dialog"
            aria-modal="true"
            aria-label={isEditing ? "Edit tag" : "Add tag"}
          >
            <Stack x className="items-center justify-between gap-3">
              <Stack y>
                <h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
                  {isEditing ? "Edit tag" : "Add tag"}
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Update name and meta fields.
                </p>
              </Stack>
              <button
                type="button"
                onClick={closeModal}
                className="rounded p-1 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Stack>

            {tagForm.id ? (
              <Stack y className="gap-1">
                <label
                  htmlFor="tag-id"
                  className="font-medium text-sm text-zinc-700 dark:text-zinc-300"
                >
                  ID
                </label>
                <input
                  id="tag-id"
                  value={tagForm.id}
                  readOnly
                  className="rounded border border-zinc-200 bg-zinc-100 px-3 py-2 text-sm text-zinc-500 outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                />
              </Stack>
            ) : null}

            <Stack y className="gap-1">
              <label
                htmlFor="tag-name"
                className="font-medium text-sm text-zinc-700 dark:text-zinc-300"
              >
                Name
              </label>
              <input
                id="tag-name"
                value={tagForm.name}
                onChange={(event) =>
                  setTagForm((form) =>
                    form ? { ...form, name: event.target.value } : form,
                  )
                }
                className="rounded border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-colors focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                placeholder="Tag name"
              />
            </Stack>

            <Stack y className="gap-1">
              <label
                htmlFor="tag-meta"
                className="font-medium text-sm text-zinc-700 dark:text-zinc-300"
              >
                Meta
              </label>
              <textarea
                id="tag-meta"
                value={tagForm.meta}
                onChange={(event) =>
                  setTagForm((form) =>
                    form ? { ...form, meta: event.target.value } : form,
                  )
                }
                className="min-h-36 resize-y rounded border border-zinc-200 bg-white px-3 py-2 font-mono text-sm text-zinc-900 outline-none transition-colors focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                spellCheck={false}
              />
            </Stack>

            {formError ? (
              <p className="text-red-500 text-sm">{formError}</p>
            ) : null}

            <Stack x className="justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                className="rounded border border-zinc-200 px-3 py-2 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveTag}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded bg-zinc-900 px-3 py-2 text-sm text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save"}
              </button>
            </Stack>
          </Stack>
        </div>
      ) : null}
    </DashboardShell>
  );
}
