import {
  deletePost,
  fetchPost,
  fetchPosts,
  savePost,
  updatePostStatus,
} from "@/lib/shared/services";
import { PostInsert, Status } from "@/types";

import { makeBrowserClient } from "../supabase";

export const fetchPostsByBrowser = async () => {
  const client = makeBrowserClient();
  return fetchPosts(client);
};

export const fetchPostByBrowser = async (id: string) => {
  const client = makeBrowserClient();
  return fetchPost(id, client);
};

export const savePostByBrowser = async (
  payload: PostInsert & { id?: string },
) => {
  const client = makeBrowserClient();
  return savePost(client, payload);
};

export const updatePostStatusByBrowser = async (id: string, status: Status) => {
  const client = makeBrowserClient();
  return updatePostStatus(client, id, status);
};

export const deletePostByBrowser = async (id: string) => {
  const client = makeBrowserClient();
  return deletePost(client, id);
};
