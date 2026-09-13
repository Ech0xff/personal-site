"use server";
import { revalidatePath } from "next/cache";

import { adminAction } from "../actions/action.service";
import { removeFile, signFileUpload } from "./files.service";
export async function createFileUpload(input: unknown) {
  return adminAction(() => signFileUpload(input));
}
export async function deleteFile(path: unknown) {
  return adminAction(async () => {
    await removeFile(path);
    revalidatePath("/dashboard/files");
    return null;
  });
}
