"use server";
import { revalidatePath, updateTag } from "next/cache";
import { z } from "zod";

import {
  contentKindSchema,
  type ContentKind,
} from "#lib/shared/content/content.schema";
import { statusSchema } from "#lib/shared/content/status.schema";

import { adminAction } from "../actions/action.service";
import { contentListTag, publicPostTag } from "./content-cache.helper";
import {
  changeContentStatus,
  readContent,
  removeContent,
  writeContent,
} from "./content.service";

const identity = z.object({ kind: contentKindSchema, id: z.uuid() });
const refreshContent = (kind: ContentKind, id: string) => {
  updateTag(contentListTag(kind));
  if (kind === "posts") updateTag(publicPostTag(id.toLowerCase()));
  revalidatePath(`/dashboard/${kind === "events" ? "event" : kind}`);
  revalidatePath(`/${kind}`);
  if (kind === "posts") revalidatePath(`/posts/${id}`);
  revalidatePath("/");
};
export async function loadContent(input: unknown) {
  return adminAction(async () => {
    const { kind, id } = identity.parse(input);
    return readContent(kind, id);
  });
}
export async function saveContent(input: unknown) {
  return adminAction(async () => {
    const id = await writeContent(input);
    const { kind } = z.object({ kind: contentKindSchema }).parse(input);
    refreshContent(kind, id);
    return id;
  });
}
export async function deleteContent(input: unknown) {
  return adminAction(async () => {
    const { kind, id } = identity.parse(input);
    await removeContent(kind, id);
    refreshContent(kind, id);
    return null;
  });
}
export async function setContentStatus(input: unknown) {
  return adminAction(async () => {
    const { kind, id, status } = identity
      .extend({ status: statusSchema })
      .parse(input);
    await changeContentStatus(kind, id, status);
    refreshContent(kind, id);
    return null;
  });
}
