"use client";
import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import {
  createReactBlockSpec,
  useBlockNoteEditor,
  type ReactCustomBlockRenderProps,
} from "@blocknote/react";
import { withMultiColumn } from "@blocknote/xl-multi-column";
import * as stylex from "@stylexjs/stylex";
import { ExternalLink, Globe2, Link as LinkIcon, RotateCw } from "lucide-react";
import Image from "next/image";

import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { cmsSchema, linkCardConfig, mediaRowConfig } from "./blocknote.schema";
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
  const props = block.props;
  const host = props.url ? new URL(props.url).hostname : "";
  return (
    <div contentEditable={false} {...stylex.props(styles.editor)}>
      {editor.isEditable && (
        <div {...stylex.props(styles.urlBar)}>
          <LinkIcon size={14} aria-hidden />
          <input
            aria-label={copy.cardUrl}
            placeholder="https://…"
            type="url"
            value={url}
            onChange={(event) => changeUrl(event.target.value)}
            {...stylex.props(styles.urlInput)}
          />
          {props.url && (
            <button
              type="button"
              aria-label={copy.refreshMetadata}
              title={copy.refreshMetadata}
              disabled={pending || url.trim() !== props.url}
              onClick={() => void refresh()}
              {...stylex.props(styles.iconButton)}
            >
              <RotateCw size={14} aria-hidden />
            </button>
          )}
        </div>
      )}
      {props.url && (
        <a
          href={props.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-busy={pending}
          {...stylex.props(styles.card)}
        >
          <span {...stylex.props(styles.copy)}>
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
              <span {...stylex.props(styles.site)}>
                {props.siteName || host}
              </span>
              <ExternalLink size={12} aria-hidden />
            </span>
            <span {...stylex.props(styles.title)}>{props.title || host}</span>
            {props.description && (
              <span {...stylex.props(styles.description)}>
                {props.description}
              </span>
            )}
            <span {...stylex.props(styles.domain)}>{host}</span>
          </span>
          {props.image && (
            <Image
              unoptimized
              width={288}
              height={256}
              src={props.image}
              alt=""
              {...stylex.props(styles.image)}
            />
          )}
        </a>
      )}
      {editor.isEditable && (
        <output {...stylex.props(styles.notice)}>
          {pending ? copy.loading : notice}
        </output>
      )}
    </div>
  );
}
export const editableCmsSchema = withMultiColumn(
  BlockNoteSchema.create({
    blockSpecs: {
      ...defaultBlockSpecs,
      linkCard: createReactBlockSpec(linkCardConfig, {
        render: LinkCardEditor,
      })(),
      // Keep previously saved rows readable; new editing uses native blocks.
      mediaRow: createReactBlockSpec(mediaRowConfig, {
        render: () => <span />,
      })(),
    },
  }),
);
const copy = defaultDictionary.editor;
