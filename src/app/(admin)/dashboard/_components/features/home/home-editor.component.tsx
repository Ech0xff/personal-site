"use client";

import * as stylex from "@stylexjs/stylex";
import { ExternalLink, RotateCcw, Save } from "lucide-react";
import { useState } from "react";

import Button from "#components/ui/button.component";
import { PaperField } from "#components/ui/paper-field.component";
import type { AudioAsset } from "#lib/shared/audio/audio.schema";
import type { DeskConfiguration } from "#lib/shared/desk/desk-configuration.schema";
import { ROUTES } from "#lib/shared/routes/routes.const";

import DashboardShell from "../../layout/dashboard-shell.component";
import { useHomepageEditor } from "./home-editor.hook";
import { editorStyles as styles } from "./home-editor.style";
import { ItemFields } from "./item-fields.component";
import { RecordEditor } from "./record-editor.component";

const sections = [
  { type: "intro", title: "Introduction" },
  { type: "books", title: "Posts" },
  { type: "letter", title: "Thoughts" },
  { type: "display", title: "Display" },
  { type: "record", title: "Music" },
] as const;

export default function HomepageEditor({
  initial,
  initialAudio,
}: Readonly<{
  initial: DeskConfiguration;
  initialAudio: readonly AudioAsset[];
}>) {
  const editor = useHomepageEditor(initial);
  const [assets, setAssets] = useState(initialAudio);
  return (
    <DashboardShell
      title="Homepage"
      actions={
        <div {...stylex.props(styles.toolbar)}>
          <a
            href={ROUTES.HOME}
            target="_blank"
            rel="noreferrer"
            {...stylex.props(styles.link)}
          >
            View homepage <ExternalLink size={13} aria-hidden />
          </a>
          <Button
            onClick={editor.discard}
            disabled={!editor.dirty || editor.busy}
          >
            <RotateCcw size={16} aria-hidden />
            Discard changes
          </Button>
          <Button
            type="submit"
            form="homepage-editor"
            loading={editor.pending}
            disabled={!editor.dirty || editor.busy}
          >
            <Save size={16} aria-hidden />
            Save changes
          </Button>
        </div>
      }
    >
      <form
        id="homepage-editor"
        noValidate
        aria-busy={editor.pending}
        onSubmit={(event) => {
          event.preventDefault();
          editor.save();
        }}
        {...stylex.props(styles.form)}
      >
        <p {...stylex.props(styles.muted)}>
          Edit homepage text and music. Changes go live when you save.
        </p>
        <output aria-live="polite" {...stylex.props(styles.muted)}>
          {editor.audioBusy
            ? "Uploading or starting an audio import. Keep this page open until it finishes."
            : editor.pending
              ? "Saving homepage…"
              : editor.dirty
                ? "Unsaved changes"
                : "All changes saved"}
        </output>
        {editor.error && (
          <p role="alert" {...stylex.props(styles.error)}>
            {editor.error}{" "}
            {editor.unauthorized && (
              <a
                href={ROUTES.AUTH}
                target="_blank"
                rel="noreferrer"
                {...stylex.props(styles.link)}
              >
                Sign in in a new tab
              </a>
            )}
          </p>
        )}
        {sections.map((section) => {
          const itemIndex = editor.draft.items.findIndex(
            (item) => item.type === section.type,
          );
          const item = editor.draft.items.at(itemIndex);
          if (itemIndex < 0 || !item) return null;
          const prefix = `items.${itemIndex}.`;
          const errors = Object.fromEntries(
            Object.entries(editor.errors)
              .filter(([key]) => key.startsWith(prefix))
              .map(([key, message]) => [key.slice(prefix.length), message]),
          );
          return (
            <fieldset
              key={`${item.id}:${editor.revision}`}
              disabled={editor.pending}
              {...stylex.props(styles.section)}
            >
              <legend {...stylex.props(styles.heading)}>{section.title}</legend>
              <PaperField
                label="Item name"
                value={item.name}
                maxLength={80}
                error={errors.name}
                onValueChange={(name) => editor.update({ ...item, name })}
              />
              {item.type === "record" ? (
                <RecordEditor
                  tracks={item.config.tracks}
                  change={(tracks) =>
                    editor.update({ ...item, config: { tracks } })
                  }
                  assets={assets}
                  onAssets={setAssets}
                  onBusy={editor.setAudioBusy}
                  errors={errors}
                />
              ) : (
                <ItemFields
                  item={item}
                  change={editor.update}
                  errors={errors}
                />
              )}
            </fieldset>
          );
        })}
      </form>
    </DashboardShell>
  );
}
