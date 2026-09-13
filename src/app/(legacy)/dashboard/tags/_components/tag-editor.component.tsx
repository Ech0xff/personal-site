"use client";

import { Save, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { z } from "zod";

import { DEFAULT_TAG_COLOR } from "#components/features/tags/tag.const";
import Button from "#components/ui/button.component";
import IconButton from "#components/ui/icon-button.component";
import Input from "#components/ui/input.component";
import ModalPanel from "#components/ui/modal-panel.component";
import type { TagWithCount } from "#types";

const metaSchema = z.record(z.string(), z.json());
type TagInput = Readonly<{ name: string; meta: z.infer<typeof metaSchema> }>;
type Props = Readonly<{
  tag?: TagWithCount;
  onSave: (input: TagInput) => Promise<void>;
  onClose: () => void;
}>;

import "./tag-editor.component.scss";

export default function TagEditor({ tag, onSave, onClose }: Props) {
  const [name, setName] = useState(tag?.name ?? "");
  const [meta, setMeta] = useState(() => metaSchema.parse(tag?.meta ?? {}));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const color = typeof meta.color === "string" ? meta.color : DEFAULT_TAG_COLOR;
  const selectColor = (color: string) =>
    setMeta((meta) => ({ ...meta, color }));

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({ name: name.trim(), meta });
      onClose();
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalPanel className="max-h-full w-full max-w-md overflow-y-auto p-5">
      <form
        onSubmit={save}
        className="flex flex-col gap-5"
        aria-label={tag ? "Edit tag" : "Add tag"}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              {tag ? "Edit tag" : "Add tag"}
            </h2>
            <p className="text-sm text-text-muted">Choose a name and color.</p>
          </div>
          <IconButton onClick={onClose} aria-label="Close tag editor">
            <X className="size-5" />
          </IconButton>
        </div>
        {tag && (
          <div className="flex flex-col gap-1">
            <label
              htmlFor="tag-id"
              className="text-sm font-medium text-text-secondary"
            >
              ID
            </label>
            <Input
              id="tag-id"
              value={tag.id}
              readOnly
              className="text-text-muted"
            />
          </div>
        )}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="tag-name"
            className="text-sm font-medium text-text-secondary"
          >
            Name
          </label>
          <Input
            id="tag-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tag name"
            required
            disabled={saving}
          />
        </div>
        <fieldset disabled={saving} className="flex min-w-0 flex-col gap-3">
          <legend className="mb-2 text-sm font-medium text-text-secondary">
            Color
          </legend>
          <div className="tag-editor-palette" inert={saving}>
            <HexColorPicker
              color={color}
              onChange={selectColor}
              aria-label="Tag color palette"
            />
          </div>
          <div className="flex items-center gap-3">
            <label htmlFor="tag-color" className="text-sm text-text-secondary">
              Hex color
            </label>
            <HexColorInput
              id="tag-color"
              color={color}
              onChange={selectColor}
              prefixed
              className="h-10 min-w-0 flex-1 rounded-lg border border-border-default bg-surface-input px-3 font-mono text-sm text-text-primary"
            />
          </div>
          <div className="rounded-lg bg-surface-muted p-3">
            <span
              className="text-lg font-semibold break-words"
              style={{ color }}
            >
              {name.trim() || "Tag preview"}
            </span>
          </div>
        </fieldset>
        {error && (
          <p role="alert" className="text-sm text-danger-text">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            <Save className="size-4" />
            Save
          </Button>
        </div>
      </form>
    </ModalPanel>
  );
}
