"use cache";
import Stack from "@/components/ui/Stack";
import StackY from "@/components/ui/StackY";
import { fetchSummary } from "@/lib/shared/services";
import { cn } from "@/lib/shared/utils";
import { BlogSummaryData } from "@/types";

import AnimationSection from "./components/AnimationSection";
import { IntroductionSection } from "./components/IntroductionSection";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const data = (await fetchSummary(5)) as BlogSummaryData;

  return (
    <>
      <AnimationSection />
      <StackY className="relative flex w-full flex-col gap-3 pt-[10svh]">
        {/* background */}
        <Stack
          className={cn(
            "absolute top-0 bottom-0 left-1/2 w-dvw -translate-x-1/2 transition-all duration-300",
            "bg-linear-to-b from-(--theme-bg)/0 to-(--theme-bg) to-[18svh]",
            "group-data-[scrolled=true]:top-[-18svh]",
          )}
        />
        <IntroductionSection locale={locale} data={data} />
      </StackY>
    </>
  );
}
