"use cache";

import { Metadata } from "next";

import { getI18n } from "@/i18n/tools";
import { fetchThoughts } from "@/lib/shared/services";
import { makeStaticClient } from "@/lib/shared/supabase";
import ThoughtTimeline from "@/lib/shared/utils/thoughts/ThoughtTimeline";

import CollectionBody from "../components/CollectionBody";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getI18n("IndexThoughts", locale);

  return {
    title: t("metaTitle"),
  };
}

export default async function ThoughtsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getI18n("IndexThoughts", locale);
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
      <ThoughtTimeline thoughts={thoughts} />
    </CollectionBody>
  );
}
