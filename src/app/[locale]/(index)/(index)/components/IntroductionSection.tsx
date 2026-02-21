import PostListItem from "@/components/features/posts/PostCard";
import { Bilibili, Email, Github, Qq } from "@/components/icons";
import Stack from "@/components/ui/Stack";
import StackY from "@/components/ui/StackY";
import { getI18n } from "@/i18n/tools";
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
  const t = await getI18n("IndexHome", locale);

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
      value: "BBLF",
      link: "https://space.bilibili.com/",
      icon: Bilibili,
    },
    {
      name: "GitHub",
      value: "BBLF",
      link: "https://github.com/",
      icon: Github,
    },
    {
      name: "Email",
      value: "Send Me",
      link: "mailto:your@email.com",
      icon: Email,
    },
    {
      name: "QQ",
      value: "Talk to Me",
      link: "#",
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
    <StackY className="mb-8 gap-8 px-4">
      {/* About Card */}
      <Card title={t("about.cardTitle")}>
        <p className="indent-8 text-sm leading-relaxed">
          {t("about.description")}
        </p>
      </Card>
      {/* Find Me Card */}
      <Card title={t("find.cardTitle")}>
        <Stack className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.link}
              target={item.link.startsWith("mailto") ? undefined : "_blank"}
              rel={
                item.link.startsWith("mailto")
                  ? undefined
                  : "noopener noreferrer"
              }
              className="group relative flex h-24 flex-col justify-between overflow-hidden rounded-2xl bg-slate-50 p-4 transition-all duration-300 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10"
            >
              <Stack
                x
                className="relative z-10 flex h-full flex-col justify-between"
              >
                <Stack className="text-xs font-medium text-slate-400">
                  {item.name}
                </Stack>
                <Stack className="text-base font-bold text-slate-700 transition-colors dark:text-slate-200">
                  {item.value}
                </Stack>
              </Stack>
              <item.icon
                className={cn(
                  "absolute top-[50%] right-5 aspect-square h-15 w-15 translate-y-[-50%] opacity-50 transition-transform duration-300 group-hover:scale-110",
                  "text-slate-400 dark:text-slate-500",
                )}
              />
            </a>
          ))}
        </Stack>
      </Card>
      {/* Latest Posts */}
      <Card title={t("latestPosts.cardTitle")}>
        <Stack y>
          {posts.length == 0 && (
            <p style={{ textIndent: "2em" }}>{t("latestPosts.empty")}</p>
          )}
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} />
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
    </StackY>
  );
}
