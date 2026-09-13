"use client";
import * as stylex from "@stylexjs/stylex";
import { Save } from "lucide-react";

import BlockEditor from "#components/ui/blocknote/block-editor.component";
import Button from "#components/ui/button.component";
import CloseButton from "#components/ui/close-button.component";
import Loading from "#components/ui/loading.component";
import type { ContentKind } from "#lib/shared/content/content.schema";

import { useContentEditor } from "./content-editor.hook";
import { styles } from "./content-panel.style";
import { contentLabels } from "./content.const";
import PublishTime from "./publish-time.component";
import { VisibilityControl } from "./visibility-control.component";
export default function ContentEditor({
  kind,
  id,
  onClose,
  onSaved,
}: Readonly<{
  kind: ContentKind;
  id?: string;
  onClose: () => void;
  onSaved: () => void;
}>) {
  const editor = useContentEditor(kind, id, onSaved);
  return (
    <section {...stylex.props(styles.editor)} aria-label="Content editor">
      <header {...stylex.props(styles.header)}>
        <h2 {...stylex.props(styles.title)}>
          {id ? "Edit" : "New"} {contentLabels[kind].singular}
        </h2>
        <div {...stylex.props(styles.toolbar)}>
          {editor.state.type === "ready" && (
            <div {...stylex.props(styles.metadata)}>
              <PublishTime
                value={editor.state.form.published_at}
                onChange={(published_at) => editor.update({ published_at })}
              />
              <VisibilityControl
                value={editor.state.form.status}
                onChange={(status) => editor.update({ status })}
              />
              {kind === "events" && (
                <label title="Event color" {...stylex.props(styles.colorField)}>
                  <span
                    aria-hidden
                    {...stylex.props(styles.colorSwatch)}
                    style={{ backgroundColor: editor.state.form.color }}
                  />
                  <input
                    aria-label="Event color"
                    type="color"
                    value={editor.state.form.color}
                    onChange={(event) =>
                      editor.update({ color: event.target.value })
                    }
                    {...stylex.props(styles.colorInput)}
                  />
                </label>
              )}
            </div>
          )}

          <Button
            xstyle={styles.save}
            onClick={editor.save}
            loading={editor.pending}
            disabled={editor.state.type !== "ready" || editor.uploads > 0}
          >
            <Save size={17} aria-hidden />
            {editor.uploads ? "Uploading…" : "Save"}
          </Button>
          <CloseButton
            xstyle={styles.close}
            aria-label="Close editor"
            onClick={onClose}
            disabled={editor.pending || editor.uploads > 0}
          />
        </div>
      </header>
      <div {...stylex.props(styles.scroll)}>
        {editor.state.type === "loading" && <Loading />}
        {editor.state.type === "error" && (
          <div role="alert">
            <p>{editor.state.message}</p>
            <Button onClick={editor.retry}>Retry</Button>
          </div>
        )}
        {editor.state.type === "ready" && (
          <div {...stylex.props(styles.fields)}>
            {editor.error && (
              <p role="alert" {...stylex.props(styles.error)}>
                {editor.error}{" "}
                {editor.unauthorized && (
                  <a href="/auth" target="_blank" rel="noreferrer">
                    Sign in in a new tab
                  </a>
                )}
              </p>
            )}
            <BlockEditor
              initialContent={editor.state.form.content}
              editable={!editor.pending}
              onChange={(content) => editor.update({ content })}
              onUploadChange={editor.changeUploads}
            />
          </div>
        )}
      </div>
    </section>
  );
}
