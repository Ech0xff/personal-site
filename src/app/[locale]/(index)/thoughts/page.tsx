import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { fetchCachedThoughts } from "@/lib/server/services-cache/thoughts";
import ThoughtTimeline from "@/lib/shared/utils/thoughts/ThoughtTimeline";

import CollectionBody from "../components/CollectionBody";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "IndexThoughts" });

  return {
    title: t("metaTitle"),
  };
}

export default async function ThoughtsPage() {
  const t = await getTranslations("IndexThoughts");
  const thoughts = await fetchCachedThoughts();
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
