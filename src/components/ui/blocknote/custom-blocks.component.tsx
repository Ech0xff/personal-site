"use client";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import {
  createReactBlockSpec,
  useBlockNoteEditor,
  type ReactCustomBlockRenderProps,
} from "@blocknote/react";
import { ColumnBlock } from "@blocknote/xl-multi-column";
import * as stylex from "@stylexjs/stylex";
import { ExternalLink, Globe2, Pencil, Check, RotateCw } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { columnLayoutBlock } from "#lib/shared/content/column-layout.extension";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { cmsSchema, linkCardConfig, mediaRowConfig } from "./blocknote.schema";
import { codeBlock } from "./code-block.extension";
import { useLinkCard } from "./link-card.hook";
import { cardStyles as styles } from "./link-card.style";
function LinkCardEditor({
  block,
}: ReactCustomBlockRenderProps<typeof linkCardConfig>) {
  const editor = useBlockNoteEditor(cmsSchema);
  const { url, pending, notice, changeUrl, refresh } = useLinkCard(
    editor,
    block.id,
  );
  const [editing, setEditing] = useState(!block.props.url);
  const props = block.props;
  const host = props.url ? new URL(props.url).hostname : "";
  return (
    <div contentEditable={false} {...stylex.props(styles.editor)}>
      <div
        data-cms-link-card
        aria-busy={pending}
        {...stylex.props(styles.card)}
      >
        {editor.isEditable && !editing && (
          <button
            type="button"
            aria-label={copy.editLink}
            title={copy.editLink}
            onClick={() => setEditing(true)}
            {...stylex.props(styles.iconButton, styles.editButton)}
          >
            <Pencil size={14} />
          </button>
        )}
        <div {...stylex.props(styles.copy)}>
          <span {...stylex.props(styles.source)}>
            {props.icon ? (
              <Image
                unoptimized
                width={16}
                height={16}
                src={props.icon}
                alt=""
                {...stylex.props(styles.logo)}
              />
            ) : (
              <Globe2 size={14} aria-hidden />
            )}
            <span {...stylex.props(styles.site)}>{props.siteName || host}</span>
            <ExternalLink size={12} aria-hidden />
          </span>
          <a
            href={props.url || undefined}
            target="_blank"
            rel="noopener noreferrer"
            {...stylex.props(styles.title, styles.titleLink)}
          >
            {props.title || host || "Link card"}
          </a>
          {props.description && (
            <span {...stylex.props(styles.description)}>
              {props.description}
            </span>
          )}
          {editor.isEditable && (editing || !props.url) ? (
            <div {...stylex.props(styles.urlBar)}>
              <input
                aria-label={copy.cardUrl}
                placeholder="https://…"
                type="url"
                value={url}
                onChange={(event) => changeUrl(event.target.value)}
                {...stylex.props(styles.urlInput)}
              />
              <button
                type="button"
                aria-label={copy.refreshMetadata}
                disabled={pending || !props.url || url.trim() !== props.url}
                onClick={() => void refresh()}
                {...stylex.props(styles.iconButton)}
              >
                <RotateCw size={14} />
              </button>
              <button
                type="button"
                aria-label={copy.finishLink}
                disabled={!props.url || url.trim() !== props.url}
                onClick={() => setEditing(false)}
                {...stylex.props(styles.iconButton)}
              >
                <Check size={14} />
              </button>
            </div>
          ) : (
            <span {...stylex.props(styles.domain)}>{host}</span>
          )}
          {editor.isEditable && (pending || notice) && (
            <output {...stylex.props(styles.notice)}>
              {pending ? copy.loading : notice}
            </output>
          )}
        </div>
        {props.image && (
          <Image
            unoptimized
            width={288}
            height={256}
            data-cms-card-image
            src={props.image}
            alt=""
            {...stylex.props(styles.image)}
          />
        )}
      </div>
    </div>
  );
}
export const editableCmsSchema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    codeBlock,
    column: ColumnBlock,
    columnList: columnLayoutBlock,
    linkCard: createReactBlockSpec(linkCardConfig, {
      render: LinkCardEditor,
    })(),
    // Keep previously saved rows readable; new editing uses native blocks.
    mediaRow: createReactBlockSpec(mediaRowConfig, {
      render: () => <span />,
    })(),
  },
});
const copy = defaultDictionary.editor;
