import type { Metadata } from "next";
import { cacheTag } from "next/cache";

import ThoughtTimeline from "#components/features/thoughts/thought-timeline.component";
import { useDictionary } from "#dictionary";
import { CACHE_TAGS } from "#lib/server/cache";
import { getDictionary } from "#lib/server/dictionary/dictionary.service";
import { formatRichMessage } from "#lib/shared/dictionary/dictionary.helper";
import { fetchThoughts } from "#lib/shared/services";
import { makeStaticClient } from "#lib/shared/supabase.client";

import CollectionBody from "../_components/collection-body.component";

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();

  return {
    title: dictionary.indexThoughts.metaTitle,
  };
}

export default async function ThoughtsPage() {
  "use cache";
  cacheTag(CACHE_TAGS.thoughts);

  const client = makeStaticClient();
  const thoughts = await fetchThoughts(client);

  return <ThoughtsPageContent thoughts={thoughts} />;
}

function ThoughtsPageContent({
  thoughts,
}: {
  thoughts: Awaited<ReturnType<typeof fetchThoughts>>;
}) {
  const dictionary = useDictionary();
  const totalThoughts = thoughts.length;
  const totalCharacters = thoughts.reduce(
    (acc, t) => acc + t.content.length,
    0,
  );

  return (
    <CollectionBody
      title={dictionary.indexThoughts.title}
      description={formatRichMessage(dictionary.indexThoughts.description, {
        totalThoughts,
        totalCharacters,
        b: (chunks) => (
          <span className="font-bold text-text-primary">{chunks}</span>
        ),
      })}
    >
      <ThoughtTimeline thoughts={thoughts} />
    </CollectionBody>
  );
}
