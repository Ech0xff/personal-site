import { Check, CircleDashed, Clock, ListChecks, X } from "lucide-react";

import ContributionCalendar from "@/components/features/contributions/ContributionCalendar";
import TagMarquee from "@/components/features/tags/TagMarquee";
import ContentRenderer from "@/components/ui/content/ContentRenderer";
import Stack from "@/components/ui/Stack";
import type { RecentPlan } from "@/lib/shared/config";
import { generatePlaylistUrl } from "@/lib/shared/config/utils";
import { getT } from "@/lib/shared/i18n/tools";
import type { BlogSummaryData, RecentActivityItem } from "@/types";

import Card from "./Card";
import RecentActivityList from "./RecentActivityList";

const getPlaylistEmbedUrl = (playlistUrl: string, theme: "dark" | "light") => {
  try {
    return generatePlaylistUrl(playlistUrl, theme);
  } catch {
    return "";
  }
};

const recentPlanStatusIcons: Record<RecentPlan["status"], typeof Clock> = {
  waiting: Clock,
  pending: CircleDashed,
  completed: Check,
  failed: X,
};

export async function IntroductionSection({
  locale,
  data,
  recentActivity,
  config,
}: {
  locale?: string;
  data: BlogSummaryData;
  recentActivity: RecentActivityItem[];
  config: {
    aboutMe: string;
    playlistUrl: string;
    recentPlan: RecentPlan[];
  };
}) {
  const t = getT("IndexHome", locale);

  const tags = data.tags ?? [];

  const totalCharacters =
    data.posts.characters + data.thoughts.characters + data.events.characters;
  const playlistUrl = config.playlistUrl?.trim();
  const darkPlaylistUrl = playlistUrl
    ? getPlaylistEmbedUrl(playlistUrl, "dark")
    : "";
  const lightPlaylistUrl = playlistUrl
    ? getPlaylistEmbedUrl(playlistUrl, "light")
    : "";
  const hasPlaylist = Boolean(darkPlaylistUrl && lightPlaylistUrl);

  const statsItems = [
    {
      label: t("stats.posts"),
      count: data.posts.count,
    },
    {
      label: t("stats.thoughts"),
      count: data.thoughts.count,
    },
    {
      label: t("stats.events"),
      count: data.events.count,
    },
    {
      label: t("stats.characters"),
      count: totalCharacters,
    },
  ];

  return (
    <Stack
      y
      className="mx-auto mb-8 w-[calc(100svw-2*var(--layout-padding-x))] gap-8 px-4"
    >
      {/* About Card */}
      <Card title={t("about.cardTitle")}>
        <Stack y className="gap-4 rounded-2xl p-4">
          <ContentRenderer content={config.aboutMe} />
        </Stack>
      </Card>

      <Card title={t("recentActivity.cardTitle")}>
        <RecentActivityList locale={locale} items={recentActivity} />
      </Card>

      {/* Stats Card */}
      <Card title={t("stats.cardTitle")}>
        <Stack y className="gap-4">
          <ContributionCalendar
            locale={locale}
            posts={data.posts.contributions}
            thoughts={data.thoughts.contributions}
            events={data.events.contributions}
          />

          <TagMarquee tags={tags} />
          <Stack className="grid gap-4 xl:grid-cols-2">
            <Stack
              y
              className="h-full min-h-0 rounded-2xl bg-slate-50 p-4 dark:bg-white/5"
            >
              <Stack className="grid h-full flex-1 grid-cols-2 grid-rows-2 gap-3">
                {statsItems.map((item) => (
                  <Stack
                    key={item.label}
                    y
                    className="h-full justify-between rounded-xl bg-white p-4 transition-transform duration-300 hover:scale-105 dark:bg-zinc-950/40"
                  >
                    <Stack className="font-medium text-slate-400 text-xs uppercase tracking-wider">
                      {item.label}
                    </Stack>
                    <Stack className="font-bold text-2xl text-slate-700 dark:text-slate-200">
                      {item.count}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </Stack>

            <Stack
              y
              className="min-h-0 gap-2 rounded-2xl bg-slate-50 p-4 dark:bg-white/5"
            >
              <Stack className="font-medium text-slate-400 text-xs uppercase tracking-wider">
                {t("recentPlan.title")}
              </Stack>
              <Stack y className="min-h-0 flex-1 gap-2">
                {config.recentPlan.length > 0 ? (
                  config.recentPlan.map((plan) => {
                    const StatusIcon = recentPlanStatusIcons[plan.status];
                    return (
                      <div
                        key={`${plan.task}-${plan.createdAt}`}
                        className="flex items-center justify-between gap-4 border-zinc-200 border-b py-3 last:border-b-0 dark:border-zinc-800"
                      >
                        <ListChecks className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
                        <span className="min-w-0 flex-1 truncate text-lg text-slate-700 dark:text-slate-200">
                          {plan.task}
                        </span>
                        <StatusIcon className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-500" />
                      </div>
                    );
                  })
                ) : (
                  <Stack className="flex h-full min-h-32 items-center justify-center rounded-xl border border-zinc-200 border-dashed px-4 text-center text-slate-400 dark:border-zinc-800 dark:text-slate-500">
                    {t("recentPlan.empty")}
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Card>

      {hasPlaylist && (
        <Card title={t("playlist.cardTitle")}>
          <iframe
            title={t("playlist.cardTitle")}
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            height="450"
            className="hidden w-full overflow-hidden rounded-lg border-none dark:block"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            src={darkPlaylistUrl}
          />
          <iframe
            title={t("playlist.cardTitle")}
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
            height="450"
            className="w-full overflow-hidden rounded-lg border-none dark:hidden"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
            src={lightPlaylistUrl}
          />
        </Card>
      )}
    </Stack>
  );
}
