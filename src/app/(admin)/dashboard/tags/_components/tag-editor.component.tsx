"use client";

import * as stylex from "@stylexjs/stylex";
import { Save, X } from "lucide-react";
import { useState, type FormEvent } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { z } from "zod";

import Button from "#components/ui/button.component";
import IconButton from "#components/ui/icon-button.component";
import Input from "#components/ui/input.component";
import ModalPanel from "#components/ui/modal-panel.component";
import { color, font, space, shape } from "#design/tokens.stylex";
import type { TagWithCount } from "#types";

import { DEFAULT_TAG_COLOR } from "../../_components/features/tags/tag.const";

import "./tag-editor.component.css";
const styles = stylex.create({
  modalPanel: {
    maxHeight: "100%",
    width: "100%",
    maxWidth: "448px",
    overflowY: "auto",
    paddingTop: "20px",
    paddingRight: "20px",
    paddingBottom: "20px",
    paddingLeft: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  container: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: space.sm,
  },
  heading: {
    fontSize: font.navigation,
    lineHeight: 1.5,
    fontWeight: font.semibold,
  },
  description: {
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.muted,
  },
  icon: {
    width: "20px",
    height: "20px",
  },
  container2: {
    display: "flex",
    flexDirection: "column",
    gap: space.xxs,
  },
  label: {
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
    color: color.secondary,
  },
  input: {
    color: color.muted,
  },
  fields: {
    display: "flex",
    minWidth: "0px",
    flexDirection: "column",
    gap: space.sm,
  },
  legend: {
    marginBottom: space.xs,
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
    color: color.secondary,
  },
  container3: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
  },
  label2: {
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.secondary,
  },
  hexColorInput: {
    height: "40px",
    minWidth: "0px",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: color.input,
    paddingLeft: space.sm,
    paddingRight: space.sm,
    fontFamily: font.mono,
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.text,
  },
  container4: {
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    backgroundColor: color.surfaceMuted,
    paddingTop: space.sm,
    paddingRight: space.sm,
    paddingBottom: space.sm,
    paddingLeft: space.sm,
  },
  label3: {
    fontSize: font.navigation,
    lineHeight: 1.5,
    fontWeight: font.semibold,
    overflowWrap: "break-word",
  },
  description2: {
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.dangerText,
  },
  container5: {
    display: "flex",
    justifyContent: "flex-end",
    gap: space.xs,
  },
  icon2: {
    width: space.md,
    height: space.md,
  },
});
const metaSchema = z.record(z.string(), z.json());
type TagInput = Readonly<{
  name: string;
  meta: z.infer<typeof metaSchema>;
}>;
type Props = Readonly<{
  tag?: TagWithCount;
  onSave: (input: TagInput) => Promise<void>;
  onClose: () => void;
}>;
export default function TagEditor({ tag, onSave, onClose }: Props) {
  const [name, setName] = useState(tag?.name ?? "");
  const [meta, setMeta] = useState(() => metaSchema.parse(tag?.meta ?? {}));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const color = typeof meta.color === "string" ? meta.color : DEFAULT_TAG_COLOR;
  const selectColor = (color: string) =>
    setMeta((meta) => ({
      ...meta,
      color,
    }));
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
      await onSave({
        name: name.trim(),
        meta,
      });
      onClose();
    } catch {
      setError("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <ModalPanel xstyle={styles.modalPanel}>
      <form
        onSubmit={save}
        {...stylex.props(styles.form)}
        aria-label={tag ? "Edit tag" : "Add tag"}
      >
        <div {...stylex.props(styles.container)}>
          <div>
            <h2 {...stylex.props(styles.heading)}>
              {tag ? "Edit tag" : "Add tag"}
            </h2>
            <p {...stylex.props(styles.description)}>
              Choose a name and color.
            </p>
          </div>
          <IconButton onClick={onClose} aria-label="Close tag editor">
            <X {...stylex.props(styles.icon)} />
          </IconButton>
        </div>
        {tag && (
          <div {...stylex.props(styles.container2)}>
            <label htmlFor="tag-id" {...stylex.props(styles.label)}>
              ID
            </label>
            <Input id="tag-id" value={tag.id} readOnly xstyle={styles.input} />
          </div>
        )}
        <div {...stylex.props(styles.container2)}>
          <label htmlFor="tag-name" {...stylex.props(styles.label)}>
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
        <fieldset disabled={saving} {...stylex.props(styles.fields)}>
          <legend {...stylex.props(styles.legend)}>Color</legend>
          <div data-color-picker inert={saving}>
            <HexColorPicker
              color={color}
              onChange={selectColor}
              aria-label="Tag color palette"
            />
          </div>
          <div {...stylex.props(styles.container3)}>
            <label htmlFor="tag-color" {...stylex.props(styles.label2)}>
              Hex color
            </label>
            <HexColorInput
              id="tag-color"
              color={color}
              onChange={selectColor}
              prefixed
              {...stylex.props(styles.hexColorInput)}
            />
          </div>
          <div {...stylex.props(styles.container4)}>
            <span
              {...stylex.props(styles.label3)}
              style={{
                color,
              }}
            >
              {name.trim() || "Tag preview"}
            </span>
          </div>
        </fieldset>
        {error && (
          <p role="alert" {...stylex.props(styles.description2)}>
            {error}
          </p>
        )}
        <div {...stylex.props(styles.container5)}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            <Save {...stylex.props(styles.icon2)} />
            Save
          </Button>
        </div>
      </form>
    </ModalPanel>
  );
}
