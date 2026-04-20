import { cacheTag } from "next/cache";

import Stack from "@/components/ui/Stack";
import { CACHE_TAGS } from "@/lib/server/cache";
import {
  defaultSiteConfig,
  parseSiteConfig,
  SITE_CONFIG_KEY,
} from "@/lib/shared/config/site";
import { fetchConfig, fetchPosts, fetchSummary } from "@/lib/shared/services";
import { cn } from "@/lib/shared/utils";
import type { BlogSummaryData } from "@/types";

import AnimationSection from "./_components/AnimationSection";
import { IntroductionSection } from "./_components/IntroductionSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  "use cache";
  cacheTag(CACHE_TAGS.summary);
  cacheTag(CACHE_TAGS.config);

  const { locale } = await params;
  const [data, posts, config] = await Promise.all([
    fetchSummary() as Promise<BlogSummaryData>,
    fetchPosts(undefined, 5),
    fetchConfig(undefined, SITE_CONFIG_KEY, locale.replace("-", "_"), true),
  ]);

  return (
    <>
      <AnimationSection />
      <Stack y className="group relative w-full gap-3 pt-[10svh]">
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
          posts={posts}
          config={config ? parseSiteConfig(config) : defaultSiteConfig}
        />
      </Stack>
    </>
  );
}
