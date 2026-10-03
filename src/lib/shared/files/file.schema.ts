import { z } from "zod";
export const FILE_BUCKET = "files";
export const MAX_FILE_SIZE = 50 * 1024 * 1024;
export const fileUploadSchema = z.object({
  name: z.string().min(1).max(255),
  size: z
    .number()
    .int()
    .positive("Select a non-empty file.")
    .max(MAX_FILE_SIZE, "Files must be 50 MiB or smaller."),
  type: z.string().max(255),
});
export type FileUpload = Readonly<z.infer<typeof fileUploadSchema>>;
export const filePathSchema = z
  .string()
  .regex(/^[0-9a-f-]{36}-[a-zA-Z0-9._-]+$/, "Invalid file path.");
export const fileQuerySchema = z.object({
  sort: z.enum(["time", "size"]).catch("time"),
  direction: z.enum(["asc", "desc"]).catch("desc"),
  search: z.string().max(255).default(""),
  page: z.coerce.number().int().nonnegative().max(100000).catch(0),
});
export type FileQuery = Readonly<z.infer<typeof fileQuerySchema>>;
export type StoredFile = Readonly<{
  id: string;
  name: string;
  path: string;
  url: string;
  size: number;
  type: string;
  createdAt: string;
}>;
export type FilePage = Readonly<{
  items: StoredFile[];
  hasMore: boolean;
  totalCount: number;
  totalSize: number;
}>;
