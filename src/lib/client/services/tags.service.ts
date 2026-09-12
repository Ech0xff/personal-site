import { createTag, updateTag } from "#lib/shared/services/tags.service";
import type { TablesInsert, TablesUpdate } from "#types";

import { makeBrowserClient } from "../supabase.client";

type TagInsert = TablesInsert<"tags">;
type TagUpdate = TablesUpdate<"tags">;

export const createTagByBrowser = async (input: TagInsert) => {
  return createTag(input, makeBrowserClient());
};

export const updateTagByBrowser = async (input: TagUpdate) => {
  return updateTag(input, makeBrowserClient());
};
