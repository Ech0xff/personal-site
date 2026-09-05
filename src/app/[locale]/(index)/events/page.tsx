import type { Metadata } from "next";
import { cacheTag } from "next/cache";

import EventTimeline from "#components/features/events/EventTimeline";
import { useT } from "#i18n";
import { CACHE_TAGS } from "#lib/server/cache";
import { getScopedT } from "#lib/server/i18n";
import { fetchEvents } from "#lib/shared/services";
import { makeStaticClient } from "#lib/shared/supabase";

import CollectionBody from "../_components/CollectionBody";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedT((d) => d.indexEvents);

  return {
    title: t((d) => d.metaTitle),
  };
}

export default async function EventsPage() {
  "use cache";
  cacheTag(CACHE_TAGS.events);

  const client = makeStaticClient();
  const events = await fetchEvents(client);

  return <EventsPageContent events={events} />;
}

function EventsPageContent({
  events,
}: {
  events: Awaited<ReturnType<typeof fetchEvents>>;
}) {
  const t = useT().scope((d) => d.indexEvents);
  const totalEvents = events.length;

  return (
    <CollectionBody
      title={t((d) => d.title)}
      description={t.rich((d) => d.description, {
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
