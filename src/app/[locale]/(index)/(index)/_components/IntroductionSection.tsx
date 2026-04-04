import PostListItem from "@/components/features/posts/PostCard";
import { Bilibili, Email, Github, Qq } from "@/components/icons";
import Stack from "@/components/ui/Stack";
import { getT } from "@/lib/shared/i18n/tools";
import { cn } from "@/lib/shared/utils";
import { BlogSummaryData } from "@/types";

import Card from "./Card";

export async function IntroductionSection({
  locale,
  data,
}: {
  locale?: string;
  data: BlogSummaryData;
}) {
  const t = getT("IndexHome", locale);

  const {
    recently: { posts },
    statistics,
  } = data;

  const totalCharacters = statistics
    ? statistics.posts.show.characters +
      statistics.thoughts.show.characters +
      statistics.events.show.characters
    : 0;

  const socialLinks = [
    {
      name: "Bilibili",
      link: process.env.NEXT_PUBLIC_SOCIAL_BILIBILI_URL?.trim(),
      icon: Bilibili,
    },
    {
      name: "GitHub",
      link: process.env.NEXT_PUBLIC_SOCIAL_GITHUB_URL?.trim(),
      icon: Github,
    },
    {
      name: "Email",
      link: process.env.NEXT_PUBLIC_SOCIAL_EMAIL_URL?.trim(),
      icon: Email,
    },
    {
      name: "QQ",
      link: process.env.NEXT_PUBLIC_SOCIAL_QQ_URL?.trim(),
      icon: Qq,
    },
  ];

  const statsItems = [
    {
      label: t("stats.posts"),
      count: statistics.posts.show.count,
    },
    {
      label: t("stats.thoughts"),
      count: statistics.thoughts.show.count,
    },
    {
      label: t("stats.articles"),
      count: statistics.events.show.count,
    },
    {
      label: t("stats.characters"),
      count: totalCharacters,
    },
  ];

  return (
    <Stack y className="mb-8 gap-8 px-4">
      {/* About Card */}
      <Card title={t("about.cardTitle")}>
        <p className="indent-8 text-sm leading-relaxed">
          {t("about.description")}
        </p>
      </Card>
      {/* Find Me Card */}
      <Card title={t("find.cardTitle")}>
        <Stack className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {socialLinks.map((item) => {
            const isDisabled = !item.link;

            const content = (
              <>
                <Stack x className="relative z-10 h-full justify-between">
                  <Stack className="text-xs font-medium text-slate-400">
                    {item.name}
                  </Stack>
                </Stack>
                <item.icon
                  className={cn(
                    "absolute top-[50%] right-5 aspect-square h-15 w-15 translate-y-[-50%] opacity-50",
                    isDisabled
                      ? "text-slate-300 dark:text-slate-700"
                      : "text-slate-400 transition-transform duration-300 group-hover:scale-110 dark:text-slate-500",
                  )}
                />
              </>
            );

            if (isDisabled) {
              return (
                <div
                  key={item.name}
                  aria-disabled="true"
                  className="relative flex h-24 cursor-not-allowed flex-col justify-between overflow-hidden rounded-2xl bg-slate-50 p-4 opacity-60 dark:bg-white/5"
                >
                  {content}
                </div>
              );
            }

            return (
              <a
                key={item.name}
                href={item.link}
                target={item.link?.startsWith("mailto") ? undefined : "_blank"}
                rel={
                  item.link?.startsWith("mailto")
                    ? undefined
                    : "noopener noreferrer"
                }
                className="group relative flex h-24 flex-col justify-between overflow-hidden rounded-2xl bg-slate-50 p-4 transition-all duration-300 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10"
              >
                {content}
              </a>
            );
          })}
        </Stack>
      </Card>
      {/* Latest Posts */}
      <Card title={t("latestPosts.cardTitle")}>
        <Stack y>
          {posts.length == 0 && (
            <p style={{ textIndent: "2em" }}>{t("latestPosts.empty")}</p>
          )}
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} locale={locale} />
          ))}
        </Stack>
      </Card>
      {/* Stats Card */}
      <Card title={t("stats.cardTitle")}>
        <Stack className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statsItems.map((item) => (
            <Stack
              key={item.label}
              y
              className="rounded-2xl bg-slate-50 p-4 transition-transform duration-300 hover:scale-105 dark:bg-white/5"
            >
              <Stack className="text-xs font-medium tracking-wider text-slate-400 uppercase">
                {item.label}
              </Stack>
              <Stack className="mt-1 text-2xl font-bold text-slate-700 dark:text-slate-200">
                {item.count}
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Card>

      <Card title={t("playlist.cardTitle")}>
        <iframe
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          height="450"
          className="hidden w-full overflow-hidden rounded-lg border-none dark:block"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          src="https://embed.music.apple.com/cn/playlist/ume/pl.u-76oNkr3CvyGz5m1?theme=dark"
        />
        <iframe
          allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write"
          height="450"
          className="w-full overflow-hidden rounded-lg border-none dark:hidden"
          sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-storage-access-by-user-activation allow-top-navigation-by-user-activation"
          src="https://embed.music.apple.com/cn/playlist/ume/pl.u-76oNkr3CvyGz5m1?theme=light"
        />
      </Card>
    </Stack>
  );
}
