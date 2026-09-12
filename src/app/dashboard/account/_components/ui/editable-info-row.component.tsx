"use client";
import { Check, X } from "lucide-react";
import { useRef, useState } from "react";

import Button from "#components/ui/button.component";
import IconButton from "#components/ui/icon-button.component";
import Input from "#components/ui/input.component";
import Stack from "#components/ui/stack.component";

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
    <Stack y className="gap-1 sm:flex-row sm:items-center sm:gap-4">
      <span className="w-36 shrink-0 text-sm font-medium text-text-muted">
        {label}
      </span>
      <Stack x className="inline-flex items-center gap-1">
        <Stack x className={`inline-flex items-center ${widthClassName}`}>
          {isEditing ? (
            <Input
              controlSize="sm"
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
              className="w-full bg-transparent px-0"
            />
          ) : (
            <span className="flex h-8 w-full items-center text-sm text-text-primary">
              {value || placeholder}
            </span>
          )}
        </Stack>
        {isEditing ? (
          <Stack x className="items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onMouseDown={() => {
                ignoreBlurRef.current = true;
              }}
              onClick={handleSave}
              disabled={saving}
              aria-label="Save"
            >
              <Check className="h-4 w-4" />
            </Button>
            <IconButton
              size="sm"
              onMouseDown={() => {
                ignoreBlurRef.current = true;
              }}
              onClick={handleCancel}
              disabled={saving}
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </IconButton>
          </Stack>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            onClick={startEdit}
            disabled={saving}
          >
            Edit
          </Button>
        )}
      </Stack>
    </Stack>
  );
}
