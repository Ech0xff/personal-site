import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import EventTimeline from "@/components/features/events/EventTimeline";
import { fetchCachedEvents } from "@/lib/server/services-cache/events";

import CollectionBody from "../components/CollectionBody";

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "IndexEvents" });

  return {
    title: t("metaTitle"),
  };
}

export default async function EventsPage() {
  const t = await getTranslations("IndexEvents");
  const events = await fetchCachedEvents();

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
