"use client";
import * as stylex from "@stylexjs/stylex";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  Calendar,
  HardDrive,
  Upload,
} from "lucide-react";
import Link from "next/link";

import Button from "#components/ui/button.component";
import type { FilePage } from "#lib/shared/files/file.schema";

import DashboardShell from "../../layout/dashboard-shell.component";
import { FileCard } from "./file-card.component";
import { formatSize } from "./file-size.helper";
import { useFiles } from "./files.hook";
import { styles } from "./files.style";
import { UploadProgress } from "./upload-progress.component";

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
      actions={
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
        <UploadProgress files={files} />
        {items.length === 0 && (
          <p {...stylex.props(styles.muted)}>No files found.</p>
        )}
        <div {...stylex.props(styles.grid)}>
          {items.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              pending={files.pending}
              onRemove={() => files.remove(file)}
            />
          ))}
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
