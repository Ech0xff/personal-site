import type { Tag } from "@/types";

type TagJoin = {
  tags: Tag | null;
};

export const formatTags = <T extends { tags: TagJoin[] | null }>(
  data: T,
): Omit<T, "tags"> & { tags: Tag[] } => {
  const { tags, ...rest } = data;
  return {
    ...rest,
    tags: (tags || []).map((item) => item.tags).filter((tag) => tag !== null),
  };
};
