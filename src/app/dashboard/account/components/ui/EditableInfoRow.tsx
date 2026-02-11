"use client";

import { useRef, useState } from "react";

import { Check, X } from "lucide-react";

type EditableInfoRowProps = {
  label: string;
  value?: string | null;
  onSave: (nextValue: string) => Promise<void> | void;
  saving?: boolean;
  placeholder?: string;
  widthClassName?: string;
};

export default function EditableInfoRow({
  label,
  value,
  onSave,
  saving = false,
  placeholder = "—",
  widthClassName = "w-56",
}: EditableInfoRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value ?? "");
  const ignoreBlurRef = useRef(false);

  const startEdit = () => {
    setDraft(value ?? "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(value ?? "");
    setIsEditing(false);
  };

  const handleSave = async () => {
    const trimmed = draft.trim();
    const current = value ?? "";
    setIsEditing(false);

    if (trimmed === current) return;
    await onSave(trimmed);
  };

  const handleBlur = () => {
    if (ignoreBlurRef.current) {
      ignoreBlurRef.current = false;
      return;
    }
    handleCancel();
  };

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-36 shrink-0 text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </span>
      <div className="inline-flex items-center gap-1">
        <div className={`inline-flex items-center ${widthClassName}`}>
          {isEditing ? (
            <input
              type="text"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onBlur={handleBlur}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleSave();
                  return;
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  handleCancel();
                }
              }}
              disabled={saving}
              autoFocus
              className="h-8 w-full bg-transparent px-0 text-sm text-zinc-900 outline-none dark:text-zinc-100"
            />
          ) : (
            <span className="flex h-8 w-full items-center text-sm text-zinc-900 dark:text-zinc-100">
              {value || placeholder}
            </span>
          )}
        </div>
        {isEditing ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onMouseDown={() => {
                ignoreBlurRef.current = true;
              }}
              onClick={handleSave}
              disabled={saving}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              aria-label="Save"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              type="button"
              onMouseDown={() => {
                ignoreBlurRef.current = true;
              }}
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startEdit}
            disabled={saving}
            className="text-xs font-medium text-zinc-500 transition hover:text-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
