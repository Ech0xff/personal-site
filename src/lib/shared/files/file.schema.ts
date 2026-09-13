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
export const fileQuerySchema = z.object({
  sort: z.enum(["time", "size"]).default("time"),
  direction: z.enum(["asc", "desc"]).default("desc"),
  search: z.string().max(255).default(""),
  page: z.number().int().nonnegative().max(100000).default(0),
});
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
