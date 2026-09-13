import * as stylex from "@stylexjs/stylex";

import Button from "#components/ui/button.component";

import type { useFiles } from "./files.hook";
import { styles } from "./files.style";
export function UploadProgress({
  files,
}: Readonly<{
  files: Pick<
    ReturnType<typeof useFiles>,
    "uploads" | "uploading" | "runUploads"
  >;
}>) {
  return (
    <>
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
    </>
  );
}
