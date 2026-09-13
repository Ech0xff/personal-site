import type {
  DefaultBlockSchema,
  BlockNoteEditor,
  PartialBlock,
} from "@blocknote/core";
import type { multiColumnSchema } from "@blocknote/xl-multi-column";
export const linkCardConfig = {
  type: "linkCard",
  content: "none",
  propSchema: {
    url: { default: "" },
    title: { default: "" },
    description: { default: "" },
    siteName: { default: "" },
    image: { default: "" },
    icon: { default: "" },
  },
} as const;
export const mediaRowConfig = {
  type: "mediaRow",
  content: "none",
  propSchema: { columns: { default: 2, values: [2, 3] } },
} as const;
export type LinkCardProps = Readonly<{
  url: string;
  title: string;
  description: string;
  siteName: string;
  image: string;
  icon: string;
}>;

export type CmsBlockSchema = DefaultBlockSchema &
  typeof multiColumnSchema.blockSchema & {
    linkCard: typeof linkCardConfig;
    mediaRow: typeof mediaRowConfig;
  };
export type CmsEditor = BlockNoteEditor<CmsBlockSchema>;
export type CmsBlock = PartialBlock<CmsBlockSchema>;
