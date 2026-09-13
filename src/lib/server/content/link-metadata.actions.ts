"use server";
import { adminAction } from "../actions/action.service";
import { readLinkMetadata } from "./link-metadata.service";
export async function loadLinkMetadata(url: unknown) {
  return adminAction(() => readLinkMetadata(url));
}
