import type { Metadata } from "next";
import { cacheTag } from "next/cache";

import EventTimeline from "#components/features/events/event-timeline.component";
import { useDictionary } from "#dictionary";
import { CACHE_TAGS } from "#lib/server/cache";
import { getDictionary } from "#lib/server/dictionary/dictionary.service";
import { formatRichMessage } from "#lib/shared/dictionary/dictionary.helper";
import { fetchEvents } from "#lib/shared/services";
import { makeStaticClient } from "#lib/shared/supabase.client";

import CollectionBody from "../_components/collection-body.component";

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();

  return {
    title: dictionary.indexEvents.metaTitle,
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
  const dictionary = useDictionary();
  const totalEvents = events.length;

  return (
    <CollectionBody
      title={dictionary.indexEvents.title}
      description={formatRichMessage(dictionary.indexEvents.description, {
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
