"use server";
import { revalidatePath } from "next/cache";

import {
  filePathSchema,
  fileUploadSchema,
} from "#lib/shared/files/file.schema";

import { adminAction } from "../actions/action.service";
import { removeFile, signFileUpload } from "./files.service";
export async function createFileUpload(input: unknown) {
  return adminAction(() => signFileUpload(fileUploadSchema.parse(input)));
}
export async function deleteFile(path: unknown) {
  return adminAction(async () => {
    await removeFile(filePathSchema.parse(path));
    revalidatePath("/dashboard/files");
    return null;
  });
}
