import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";

import { uploadFile } from "#lib/client/files/file-upload.service";
import { deleteFile } from "#lib/server/files/files.actions";
import type { StoredFile } from "#lib/shared/files/file.schema";

type Upload = {
  id: string;
  file: File;
  status: "pending" | "uploading" | "done" | "failed";
  error?: string;
};
export function useFiles() {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const nextUpload = useRef(0);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const runUploads = async (files: File[]) => {
    if (uploading || files.length === 0) return;
    setUploading(true);
    setUploads(
      files.map((file) => ({
        id: `upload-${++nextUpload.current}`,
        file,
        status: "pending",
      })),
    );
    let completed = false;
    for (const file of files) {
      setUploads((previous) =>
        previous.map((item) =>
          item.file === file ? { ...item, status: "uploading" } : item,
        ),
      );
      try {
        await uploadFile(file);
        completed = true;
        setUploads((previous) =>
          previous.map((item) =>
            item.file === file ? { ...item, status: "done" } : item,
          ),
        );
      } catch (error) {
        setUploads((previous) =>
          previous.map((item) =>
            item.file === file
              ? {
                  ...item,
                  status: "failed",
                  error:
                    error instanceof Error ? error.message : "Upload failed.",
                }
              : item,
          ),
        );
      }
    }
    setUploading(false);
    if (completed && navigator.onLine) router.refresh();
  };
  const remove = (file: StoredFile) => {
    if (
      !confirm(
        `Delete "${file.name}"? Content that uses this file will lose access to it.`,
      )
    )
      return;
    startTransition(async () => {
      try {
        const result = await deleteFile(file.path);
        if (!result.ok) {
          toast.error(result.error);
          return;
        }
        toast.success("File deleted.");
        router.refresh();
      } catch {
        toast.error("Could not delete this file. Please try again.");
      }
    });
  };
  return { input, uploads, uploading, pending, runUploads, remove };
}
