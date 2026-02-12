import {
  deleteThought,
  fetchThought,
  fetchThoughts,
  saveThought,
  updateThoughtStatus,
} from "@/lib/shared/services";
import { Status, ThoughtInsert } from "@/types";

import { makeBrowserClient } from "../supabase";

export const fetchThoughtsByBrowser = async () => {
  const client = makeBrowserClient();
  return fetchThoughts(client);
};

export const fetchThoughtByBrowser = async (id: string) => {
  const client = makeBrowserClient();
  return fetchThought(client, id);
};

export const saveThoughtByBrowser = async (
  payload: ThoughtInsert & { id?: string },
) => {
  const client = makeBrowserClient();
  return saveThought(client, payload);
};

export const updateThoughtStatusByBrowser = async (
  id: string,
  status: Status,
) => {
  const client = makeBrowserClient();
  return updateThoughtStatus(client, id, status);
};

export const deleteThoughtByBrowser = async (id: string) => {
  const client = makeBrowserClient();
  return deleteThought(client, id);
};
