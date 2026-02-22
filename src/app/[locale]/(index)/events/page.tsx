import { Metadata } from "next";
import { cacheTag } from "next/cache";

import EventTimeline from "@/components/features/events/EventTimeline";
import { getI18n } from "@/i18n/tools";
import { CACHE_TAGS } from "@/lib/server/cache";
import { fetchEvents } from "@/lib/shared/services";
import { makeStaticClient } from "@/lib/shared/supabase";

import CollectionBody from "../components/CollectionBody";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getI18n("IndexEvents", locale);

  return {
    title: t("metaTitle"),
  };
}

export default async function EventsPage({ params }: PageProps) {
  "use cache";
  cacheTag(CACHE_TAGS.events);

  const { locale } = await params;
  const t = await getI18n("IndexEvents", locale);
  const client = makeStaticClient();
  const events = await fetchEvents(client);

  const totalEvents = events.length;

  return (
    <CollectionBody
      title={t("title")}
      description={t.rich("description", {
        total: totalEvents,
        b: (chunks) => (
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {chunks}
          </span>
        ),
      })}
    >
      <EventTimeline events={events} />
    </CollectionBody>
  );
}
