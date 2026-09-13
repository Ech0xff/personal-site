"use client";

import * as stylex from "@stylexjs/stylex";
import { Check, X } from "lucide-react";
import { useRef, useState } from "react";

import Button from "#components/ui/button.component";
import IconButton from "#components/ui/icon-button.component";
import Input from "#components/ui/input.component";
import Stack from "#components/ui/stack.component";
import type { StyleInput } from "#design/style.type";
import { color, font, space } from "#design/tokens.stylex";
const styles = stylex.create({
  width: {
    width: "224px",
  },
  label: {
    width: "144px",
    flexShrink: 0,
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
    color: color.muted,
  },
  row: {
    display: "inline-flex",
    alignItems: "center",
    gap: space.xxs,
  },
  row2: {
    display: "inline-flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "transparent",
    paddingLeft: "0px",
    paddingRight: "0px",
  },
  label2: {
    display: "flex",
    height: space.xl,
    width: "100%",
    alignItems: "center",
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.text,
  },
  row3: {
    alignItems: "center",
    gap: space.xxs,
  },
  check: {
    height: space.md,
    width: space.md,
  },
  column: {
    display: "flex",
    flexDirection: {
      default: "column",
      "@media (min-width: 640px)": "row",
    },
    gap: {
      default: space.xxs,
      "@media (min-width: 640px)": space.md,
    },
    alignItems: {
      default: null,
      "@media (min-width: 640px)": "center",
    },
  },
  layout1: {
    flexDirection: {
      default: "column",
      "@media (min-width: 640px)": "row",
    },
  },
});
type EditableInfoRowProps = {
  label: string;
  value?: string | null;
  onSave: (nextValue: string) => Promise<void> | void;
  saving?: boolean;
  placeholder?: string;
  widthStyles?: StyleInput;
};
export default function EditableInfoRow({
  label,
  value,
  onSave,
  saving = false,
  placeholder = "—",
  widthStyles = styles.width,
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
    <Stack y xstyle={[styles.column, styles.layout1]}>
      <span {...stylex.props(styles.label)}>{label}</span>
      <Stack x xstyle={styles.row}>
        <Stack x xstyle={[styles.row2, widthStyles, null]}>
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
              xstyle={styles.input}
            />
          ) : (
            <span {...stylex.props(styles.label2)}>{value || placeholder}</span>
          )}
        </Stack>
        {isEditing ? (
          <Stack x xstyle={styles.row3}>
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
              <Check {...stylex.props(styles.check)} />
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
              <X {...stylex.props(styles.check)} />
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
