import { cacheTag } from "next/cache";

import Stack from "@/components/ui/Stack";
import { CACHE_TAGS } from "@/lib/server/cache";
import { CONFIG_KEYS } from "@/lib/shared/config";
import {
  fetchConfigs,
  fetchEvents,
  fetchPosts,
  fetchSummary,
  fetchThoughts,
} from "@/lib/shared/services";
import { cn } from "@/lib/shared/utils";
import type { BlogSummaryData, RecentActivityItem } from "@/types";

import AnimationSection from "./_components/AnimationSection";
import { IntroductionSection } from "./_components/IntroductionSection";

const MARKDOWN_IMAGE_REGEX = /!\[([^\]]*)\]\([^)]+\)/g;
const MARKDOWN_LINK_REGEX = /\[([^\]]+)\]\([^)]+\)/g;
const MARKDOWN_DECORATION_REGEX = /[`*_~>#-]/g;

const toPlainText = (content: string) =>
  content
    .replace(MARKDOWN_IMAGE_REGEX, "$1")
    .replace(MARKDOWN_LINK_REGEX, "$1")
    .replace(MARKDOWN_DECORATION_REGEX, " ")
    .replace(/\s+/g, " ")
    .trim();

const buildRecentActivity = async (): Promise<RecentActivityItem[]> => {
  const [posts, thoughts, events] = await Promise.all([
    fetchPosts(undefined, 8),
    fetchThoughts(),
    fetchEvents(),
  ]);

  return [
    ...posts.map(
      (post): RecentActivityItem => ({
        id: post.id,
        kind: "post",
        published_at: post.published_at,
        tags: post.tags,
        title: post.title,
      }),
    ),
    ...thoughts.map(
      (thought): RecentActivityItem => ({
        id: thought.id,
        kind: "thought",
        published_at: thought.published_at,
        tags: [],
        title: toPlainText(thought.content),
      }),
    ),
    ...events.map(
      (event): RecentActivityItem => ({
        id: event.id,
        kind: "event",
        published_at: event.published_at,
        tags: event.tags,
        title: event.title,
      }),
    ),
  ]
    .sort(
      (a, b) =>
        new Date(b.published_at || 0).getTime() -
        new Date(a.published_at || 0).getTime(),
    )
    .slice(0, 12);
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  "use cache";
  cacheTag(CACHE_TAGS.summary);
  cacheTag(CACHE_TAGS.config);

  const { locale } = await params;
  const localeConfig = locale.replace("-", "_");
  const [data, recentActivity, configs] = await Promise.all([
    fetchSummary() as Promise<BlogSummaryData>,
    buildRecentActivity(),
    fetchConfigs([CONFIG_KEYS.aboutMe, CONFIG_KEYS.playlistUrl], {
      locale: localeConfig,
      strict: true,
    }),
  ]);
  const aboutMe = configs.get(CONFIG_KEYS.aboutMe) ?? "";
  const playlistUrl = configs.get(CONFIG_KEYS.playlistUrl) ?? "";
  return (
    <>
      <AnimationSection />
      <Stack y className="group relative flex w-full gap-3 pt-[10svh]">
        {/* background */}
        <div
          className={cn(
            "absolute top-[-18svh] left-[50%] h-[18dvh] w-dvw -translate-x-1/2 duration-300",
            "bg-linear-to-t from-(--theme-bg) from-50% to-transparent",
          )}
        />
        <IntroductionSection
          locale={locale}
          data={data}
          recentActivity={recentActivity}
          config={{
            aboutMe,
            playlistUrl,
          }}
        />
      </Stack>
    </>
  );
}
