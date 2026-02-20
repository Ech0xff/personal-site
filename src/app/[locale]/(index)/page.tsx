import { Bilibili, Email, Github, Qq } from "@/components/icons";
import StackY from "@/components/ui/StackY";
import { fetchCachedSummary } from "@/lib/server/services-cache/rpcs";
import { cn } from "@/lib/shared/utils";
import { BlogSummaryData } from "@/types";
import { getTranslations } from "next-intl/server";

import PostListItem from "@/components/features/posts/PostCard";
import HeroSection from "./components/HeroSection";

export const revalidate = 86400;

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="z-1 flex w-full flex-col">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold">
        <div className="h-5 w-1 rounded-full bg-gray-600" />
        {title}
      </h3>
      {children}
    </div>
  );
}

async function AboutMeCard() {
  const t = await getTranslations("IndexHome.about");

  return (
    <Card title={t("cardTitle")}>
      <div className="mb-8 space-y-4 text-sm leading-relaxed sm:text-base">
        <p style={{ textIndent: "2em" }}>{t("description")}</p>
      </div>
    </Card>
  );
}

async function FindMeCard() {
  const t = await getTranslations("IndexHome.find");

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
      value: "Add Me",
      link: "#",
      icon: Qq,
    },
  ];
  return (
    <Card title={t("cardTitle")}>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {socialLinks.map((item) => (
          <a
            key={item.name}
            href={item.link}
            target={item.link.startsWith("mailto") ? undefined : "_blank"}
            rel={
              item.link.startsWith("mailto") ? undefined : "noopener noreferrer"
            }
            className={cn(
              "group relative flex h-24 flex-col justify-between overflow-hidden rounded-2xl p-4 transition-all duration-300",
              "bg-slate-50 hover:bg-slate-100 dark:bg-white/5 dark:hover:bg-white/10",
            )}
          >
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div className="text-xs font-medium text-slate-400">
                {item.name}
              </div>
              <div
                className={cn(
                  "text-base font-bold text-slate-700 transition-colors dark:text-slate-200",
                )}
              >
                {item.value}
              </div>
            </div>
            <item.icon
              className={cn(
                "absolute top-[50%] right-5 w-15 h-15 aspect-square translate-y-[-50%] opacity-50 transition-transform duration-300 group-hover:scale-110",
                "text-slate-400 dark:text-slate-500",
              )}
            />
          </a>
        ))}
      </div>
    </Card>
  );
}

function PostsCard({
  posts,
  title,
  empty,
}: {
  posts?: BlogSummaryData["recently"]["posts"];
  title: string;
  empty: string;
}) {
  if (!posts || posts.length === 0) {
    return (
      <Card title={title}>
        <div className="mb-8 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          <p style={{ textIndent: "2em" }}>{empty}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title={title}>
      <div className="mb-8 space-y-1">
        {posts.map((post) => (
          <PostListItem key={post.id} post={post} />
        ))}
      </div>
    </Card>
  );
}

function StatsCard({
  statistics,
  title,
  labels,
}: {
  statistics?: BlogSummaryData["statistics"];
  title: string;
  labels: {
    posts: string;
    thoughts: string;
    articles: string;
    characters: string;
  };
}) {
  const totalCharacters = statistics
    ? statistics.posts.show.characters +
      statistics.thoughts.show.characters +
      statistics.events.show.characters
    : 0;

  return (
    <Card title={title}>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col rounded-2xl bg-slate-50 p-4 transition-transform duration-300 hover:scale-105 dark:bg-white/5">
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            {labels.posts}
          </span>
          <span className="mt-1 text-2xl font-bold text-slate-700 dark:text-slate-200">
            {statistics?.posts.show.count ?? 0}
          </span>
        </div>
        <div className="flex flex-col rounded-2xl bg-slate-50 p-4 transition-transform duration-300 hover:scale-105 dark:bg-white/5">
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            {labels.thoughts}
          </span>
          <span className="mt-1 text-2xl font-bold text-slate-700 dark:text-slate-200">
            {statistics?.thoughts.show.count ?? 0}
          </span>
        </div>
        <div className="flex flex-col rounded-2xl bg-slate-50 p-4 transition-transform duration-300 hover:scale-105 dark:bg-white/5">
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            {labels.articles}
          </span>
          <span className="mt-1 text-2xl font-bold text-slate-700 dark:text-slate-200">
            {statistics ? statistics.posts.show.count : 0}
          </span>
        </div>
        <div className="flex flex-col rounded-2xl bg-slate-50 p-4 transition-transform duration-300 hover:scale-105 dark:bg-white/5">
          <span className="text-xs font-medium tracking-wider text-slate-400 uppercase">
            {labels.characters}
          </span>
          <span className="mt-1 text-2xl font-bold text-slate-700 dark:text-slate-200">
            {totalCharacters.toLocaleString()}
          </span>
        </div>
      </div>
    </Card>
  );
}

async function IntroductionSection({ stats }: { stats?: BlogSummaryData }) {
  const tPosts = await getTranslations("IndexHome.latestPosts");
  const tStats = await getTranslations("IndexHome.stats");

  return (
    <StackY className="px-4">
      <AboutMeCard />
      <FindMeCard />
      <PostsCard
        posts={stats?.recently.posts}
        title={tPosts("cardTitle")}
        empty={tPosts("empty")}
      />
      <StatsCard
        statistics={stats?.statistics}
        title={tStats("cardTitle")}
        labels={{
          posts: tStats("posts"),
          thoughts: tStats("thoughts"),
          articles: tStats("articles"),
          characters: tStats("characters"),
        }}
      />
    </StackY>
  );
}

export default async function HomePage() {
  const stats = await fetchCachedSummary(5);

  return (
    <>
      <HeroSection />
      <StackY className="relative flex w-full flex-col gap-3 pt-[10svh]">
        {/* background */}
        <div
          className={cn(
            "absolute top-0 bottom-0 left-1/2 w-dvw -translate-x-1/2 transition-all duration-300",
            "bg-linear-to-b from-(--theme-bg)/0 to-(--theme-bg) to-[18svh]",
            "group-data-[scrolled=true]:top-[-18svh]",
          )}
        />
        <IntroductionSection stats={stats ?? undefined} />
      </StackY>
    </>
  );
}
