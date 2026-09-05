import type { Metadata } from "next";
import { cacheTag } from "next/cache";

import ThoughtTimeline from "#components/features/thoughts/ThoughtTimeline";
import { useT } from "#i18n";
import { CACHE_TAGS } from "#lib/server/cache";
import { getScopedT } from "#lib/server/i18n";
import { fetchThoughts } from "#lib/shared/services";
import { makeStaticClient } from "#lib/shared/supabase";

import CollectionBody from "../_components/CollectionBody";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getScopedT((d) => d.indexThoughts);

  return {
    title: t((d) => d.metaTitle),
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
  const t = useT().scope((d) => d.indexThoughts);
  const totalThoughts = thoughts.length;
  const totalCharacters = thoughts.reduce(
    (acc, t) => acc + t.content.length,
    0,
  );

  return (
    <CollectionBody
      title={t((d) => d.title)}
      description={t.rich((d) => d.description, {
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
