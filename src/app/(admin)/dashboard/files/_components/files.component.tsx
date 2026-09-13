"use client";
import * as stylex from "@stylexjs/stylex";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Calendar,
  Copy,
  Download,
  FileText,
  HardDrive,
  Music,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import Button from "#components/ui/button.component";
import { Magnetic } from "#components/ui/magnetic.component";
import type { FilePage } from "#lib/shared/files/file.schema";
import { formatTime } from "#lib/shared/utils/date.helper";

import DashboardShell from "../../_components/layout/dashboard-shell.component";
import { useFiles } from "./files.hook";
import { styles } from "./files.style";

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${(bytes / 1024).toFixed(1)} KB`;
export default function Files({
  items,
  hasMore,
  totalCount,
  totalSize,
  page,
  sort,
  direction,
}: FilePage & {
  page: number;
  sort: "time" | "size";
  direction: "asc" | "desc";
}) {
  const files = useFiles();
  const query = (
    nextPage: number,
    nextSort = sort,
    nextDirection = direction,
  ) =>
    `?${new URLSearchParams({ page: String(nextPage), sort: nextSort, direction: nextDirection })}`;
  const SortArrow =
    direction === "asc" ? ArrowUpWideNarrow : ArrowDownWideNarrow;
  return (
    <DashboardShell
      title="Files"
      optActions={
        <Button
          disabled={files.uploading}
          onClick={() => files.input.current?.click()}
        >
          <Upload size={18} aria-hidden />
          {files.uploading ? "Uploading…" : "Upload files"}
        </Button>
      }
    >
      <div {...stylex.props(styles.list)}>
        <input
          hidden
          multiple
          type="file"
          ref={files.input}
          aria-label="Choose files"
          onChange={(event) => {
            void files.runUploads(Array.from(event.target.files ?? []));
            event.target.value = "";
          }}
        />
        <div {...stylex.props(styles.toolbar)}>
          <nav aria-label="Sort files" {...stylex.props(styles.sorting)}>
            {(["time", "size"] as const).map((value) => {
              const Icon = value === "time" ? Calendar : HardDrive;
              return (
                <Link
                  key={value}
                  href={query(
                    0,
                    value,
                    sort === value && direction === "desc" ? "asc" : "desc",
                  )}
                  aria-label={`Sort by ${value}${sort === value ? `, ${direction === "desc" ? "descending" : "ascending"}` : ""}`}
                  {...stylex.props(
                    styles.sort,
                    sort === value && styles.selected,
                  )}
                >
                  <Icon size={17} />
                  {value === "time" ? "Time" : "Size"}
                  {sort === value && <SortArrow size={15} />}
                </Link>
              );
            })}
          </nav>
          <div {...stylex.props(styles.badges)}>
            <span {...stylex.props(styles.badge)}>
              {totalCount} {totalCount === 1 ? "file" : "files"}
            </span>
            <span {...stylex.props(styles.badge)}>
              {formatSize(totalSize)} total
            </span>
          </div>
        </div>
        {files.uploads.some((item) => item.status !== "done") && (
          <output>
            {files.uploads.map((item) => (
              <p
                key={item.id}
                {...stylex.props(item.status === "failed" && styles.error)}
              >
                {item.file.name}:{" "}
                {item.status === "failed" ? item.error : item.status}
              </p>
            ))}
            {files.uploads.some((item) => item.status === "failed") && (
              <Button
                variant="secondary"
                disabled={files.uploading}
                onClick={() =>
                  files.runUploads(
                    files.uploads
                      .filter((item) => item.status === "failed")
                      .map((item) => item.file),
                  )
                }
              >
                Retry failed uploads
              </Button>
            )}
          </output>
        )}
        {items.length === 0 && (
          <p {...stylex.props(styles.muted)}>No files found.</p>
        )}
        <div {...stylex.props(styles.grid)}>
          {items.map((file) => {
            const Icon = file.type.startsWith("audio/")
              ? Music
              : file.type.startsWith("video/")
                ? Video
                : FileText;
            return (
              <article
                key={file.id}
                data-file-card
                {...stylex.props(styles.card)}
              >
                <div {...stylex.props(styles.previewFrame)}>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Preview ${file.name}`}
                    {...stylex.props(styles.preview)}
                  >
                    {file.type.startsWith("image/") ? (
                      <Image
                        width={260}
                        height={260}
                        unoptimized
                        src={file.url}
                        alt={file.name}
                        loading="lazy"
                        {...stylex.props(styles.thumbnail)}
                      />
                    ) : (
                      <span {...stylex.props(styles.file)}>
                        <Icon size={44} strokeWidth={1.3} />
                        {file.name.split(".").pop()}
                      </span>
                    )}
                  </a>
                  <div {...stylex.props(styles.actions)}>
                    <button
                      type="button"
                      aria-label={`Copy link to ${file.name}`}
                      title="Copy link"
                      {...stylex.props(styles.icon)}
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(file.url);
                          toast.success("Link copied.");
                        } catch {
                          toast.error("Could not copy link.");
                        }
                      }}
                    >
                      <Magnetic compact>
                        <Copy size={16} />
                      </Magnetic>
                    </button>
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
                    <button
                      type="button"
                      aria-label={`Delete ${file.name}`}
                      title="Delete"
                      disabled={files.pending}
                      onClick={() => files.remove(file)}
                      {...stylex.props(styles.icon, styles.danger)}
                    >
                      <Magnetic compact>
                        <Trash2 size={16} />
                      </Magnetic>
                    </button>
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
          })}
        </div>
        {(page > 0 || hasMore) && (
          <nav aria-label="File pages" {...stylex.props(styles.pagination)}>
            {page > 0 && <Link href={query(page - 1)}>Previous</Link>}
            <span>Page {page + 1}</span>
            {hasMore && <Link href={query(page + 1)}>Next</Link>}
          </nav>
        )}
      </div>
    </DashboardShell>
  );
}
