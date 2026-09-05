import { cacheTag } from "next/cache";

import Stack from "#components/ui/Stack";
import { CACHE_TAGS } from "#lib/server/cache";
import { loadConfigsByServer } from "#lib/server/services/configs";
import { CONFIG_KEY } from "#lib/shared/config";
import {
  fetchEvents,
  fetchPosts,
  fetchSummary,
  fetchThoughts,
} from "#lib/shared/services";
import { cn, toPreviewText } from "#lib/shared/utils";
import type { BlogSummaryData, RecentActivityItem } from "#types";

import AnimationSection from "./_components/AnimationSection";
import { IntroductionSection } from "./_components/IntroductionSection";

const buildRecentActivity = async (): Promise<RecentActivityItem[]> => {
  const [posts, thoughts, events] = await Promise.all([
    fetchPosts(undefined, 8),
    fetchThoughts(),
    fetchEvents(),
  ]);

  return [
    ...posts.map((post): RecentActivityItem => ({
      id: post.id,
      kind: "post",
      published_at: post.published_at,
      tags: post.tags,
      title: post.title,
    })),
    ...thoughts.map((thought): RecentActivityItem => ({
      id: thought.id,
      kind: "thought",
      published_at: thought.published_at,
      tags: [],
      title: toPreviewText(thought.content),
    })),
    ...events.map((event): RecentActivityItem => ({
      id: event.id,
      kind: "event",
      published_at: event.published_at,
      tags: event.tags,
      title: event.title,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.published_at || 0).getTime() -
        new Date(a.published_at || 0).getTime(),
    )
    .slice(0, 12);
};

export default async function HomePage() {
  "use cache";
  cacheTag(CACHE_TAGS.summary);
  cacheTag(CACHE_TAGS.config);

  const [data, recentActivity, configs] = await Promise.all([
    fetchSummary() as Promise<BlogSummaryData>,
    buildRecentActivity(),
    loadConfigsByServer([
      CONFIG_KEY.ABOUT_ME,
      CONFIG_KEY.PLAYLIST_URL,
      CONFIG_KEY.RECENT_PLAN,
    ]),
  ]);
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
          data={data}
          recentActivity={recentActivity}
          config={{
            aboutMe: configs[CONFIG_KEY.ABOUT_ME],
            playlistUrl: configs[CONFIG_KEY.PLAYLIST_URL],
            recentPlan: configs[CONFIG_KEY.RECENT_PLAN],
          }}
        />
      </Stack>
    </>
  );
}
