"use client";

import { Plus, Save, Tags, X } from "lucide-react";
import { useState } from "react";

import TagSphere from "#components/features/tags/TagSphere";
import Stack from "#components/ui/Stack";
import type { Json, TagWithCount } from "#types";

import DashboardShell from "../_components/layout/DashboardShell";
import { useTags } from "./useTags";

type TagForm = {
  id?: string;
  meta: string;
  name: string;
};

type JsonObject = { [key: string]: Json | undefined };

export default function TagsPage() {
  const { tags: displayTags, loading, error, createTag, updateTag } = useTags();
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
          className="items-center justify-between gap-3 rounded-xl border border-(--border-default) bg-(--surface-card) px-4 py-3 text-(--text-secondary) text-sm"
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
            className="inline-flex items-center gap-1 rounded border border-(--border-default) px-2 py-1 font-medium text-(--text-secondary) transition-colors hover:border-(--border-strong) hover:bg-(--surface-hover)"
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
            className="w-full max-w-md gap-4 rounded-lg border border-(--border-default) bg-(--surface-panel) p-5 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label={isEditing ? "Edit tag" : "Add tag"}
          >
            <Stack x className="items-center justify-between gap-3">
              <Stack y>
                <h2 className="font-semibold text-(--text-primary) text-lg">
                  {isEditing ? "Edit tag" : "Add tag"}
                </h2>
                <p className="text-(--text-muted) text-sm">
                  Update name and meta fields.
                </p>
              </Stack>
              <button
                type="button"
                onClick={closeModal}
                className="rounded p-1 text-(--text-muted) transition-colors hover:bg-(--surface-hover) hover:text-(--text-primary)"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </Stack>

            {tagForm.id ? (
              <Stack y className="gap-1">
                <label
                  htmlFor="tag-id"
                  className="font-medium text-(--text-secondary) text-sm"
                >
                  ID
                </label>
                <input
                  id="tag-id"
                  value={tagForm.id}
                  readOnly
                  className="rounded border border-(--border-default) bg-(--surface-muted) px-3 py-2 text-(--text-muted) text-sm outline-none"
                />
              </Stack>
            ) : null}

            <Stack y className="gap-1">
              <label
                htmlFor="tag-name"
                className="font-medium text-(--text-secondary) text-sm"
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
                className="rounded border border-(--border-default) bg-(--surface-input) px-3 py-2 text-(--text-primary) text-sm outline-none transition-colors focus:border-blue-500"
                placeholder="Tag name"
              />
            </Stack>

            <Stack y className="gap-1">
              <label
                htmlFor="tag-meta"
                className="font-medium text-(--text-secondary) text-sm"
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
                className="min-h-36 resize-y rounded border border-(--border-default) bg-(--surface-input) px-3 py-2 font-mono text-(--text-primary) text-sm outline-none transition-colors focus:border-blue-500"
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
                className="rounded border border-(--border-default) px-3 py-2 text-(--text-secondary) text-sm transition-colors hover:bg-(--surface-hover)"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveTag}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded bg-(--surface-inverse) px-3 py-2 text-(--text-inverse) text-sm transition-colors hover:bg-(--surface-inverse-hover)"
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
