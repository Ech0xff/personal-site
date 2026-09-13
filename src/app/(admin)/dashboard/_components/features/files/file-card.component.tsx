import * as stylex from "@stylexjs/stylex";
import { Copy, Download, FileText, Music, Trash2, Video } from "lucide-react";
import { toast } from "sonner";

import IconButton from "#components/ui/icon-button.component";
import Image from "#components/ui/image.component";
import { Magnetic } from "#components/ui/magnetic.component";
import { copyText } from "#lib/client/clipboard/clipboard.service";
import type { StoredFile } from "#lib/shared/files/file.schema";
import { formatTime } from "#lib/shared/utils/date.helper";

import { formatSize } from "./file-size.helper";
import { styles } from "./files.style";
export function FileCard({
  file,
  pending,
  onRemove,
}: Readonly<{ file: StoredFile; pending: boolean; onRemove: () => void }>) {
  const Icon = file.type.startsWith("audio/")
    ? Music
    : file.type.startsWith("video/")
      ? Video
      : FileText;
  return (
    <article key={file.id} data-file-card {...stylex.props(styles.card)}>
      <div {...stylex.props(styles.previewFrame)}>
        {file.type.startsWith("image/") ? (
          <Image
            src={file.url}
            alt={file.name}
            framed
            xstyle={styles.preview}
          />
        ) : (
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Preview ${file.name}`}
            {...stylex.props(styles.preview)}
          >
            <span {...stylex.props(styles.file)}>
              <Icon size={44} strokeWidth={1.3} />
              {file.name.split(".").pop()}
            </span>
          </a>
        )}
        <div {...stylex.props(styles.actions)}>
          <IconButton
            size="sm"
            aria-label={`Copy link to ${file.name}`}
            title="Copy link"
            xstyle={styles.icon}
            onClick={async () => {
              try {
                await copyText(file.url);
                toast.success("Link copied.");
              } catch {
                toast.error("Could not copy link.");
              }
            }}
          >
            <Copy size={16} />
          </IconButton>
          <a
            href={`${file.url}?download=${encodeURIComponent(file.name)}`}
            target="_blank"
            rel="noreferrer"
            aria-label={`Download ${file.name}`}
            title="Download"
            {...stylex.props(styles.icon)}
          >
            <Magnetic compact>
              <Download size={16} />
            </Magnetic>
          </a>
          <IconButton
            size="sm"
            aria-label={`Delete ${file.name}`}
            title="Delete"
            disabled={pending}
            onClick={onRemove}
            xstyle={[styles.icon, styles.danger]}
          >
            <Trash2 size={16} />
          </IconButton>
        </div>
      </div>
      <div {...stylex.props(styles.details)}>
        <h3 title={file.name} {...stylex.props(styles.name)}>
          {file.name}
        </h3>
        <p {...stylex.props(styles.metadata)}>
          {formatSize(file.size)} · {formatTime(file.createdAt)}
        </p>
      </div>
    </article>
  );
}
