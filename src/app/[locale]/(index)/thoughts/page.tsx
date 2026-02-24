import { Metadata } from "next";
import { cacheTag } from "next/cache";

import ThoughtTimeline from "@/components/features/thoughts/ThoughtTimeline";
import { CACHE_TAGS } from "@/lib/server/cache";
import { getT } from "@/lib/shared/i18n/tools";
import { fetchThoughts } from "@/lib/shared/services";
import { makeStaticClient } from "@/lib/shared/supabase";

import CollectionBody from "../_components/CollectionBody";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = getT("IndexThoughts", locale);

  return {
    title: t("metaTitle"),
  };
}

export default async function ThoughtsPage({ params }: PageProps) {
  "use cache";
  cacheTag(CACHE_TAGS.thoughts);

  const { locale } = await params;
  const t = getT("IndexThoughts", locale);
  const client = makeStaticClient();
  const thoughts = await fetchThoughts(client);
  const totalThoughts = thoughts.length;
  const totalCharacters = thoughts.reduce(
    (acc, t) => acc + t.content.length,
    0,
  );

  return (
    <CollectionBody
      title={t("title")}
      description={t.rich("description", {
        totalThoughts,
        totalCharacters,
        b: (chunks) => (
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {chunks}
          </span>
        ),
      })}
    >
      <ThoughtTimeline thoughts={thoughts} locale={locale} />
    </CollectionBody>
  );
}
