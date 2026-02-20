import { Metadata } from "next";

import { fetchCachedThoughts } from "@/lib/server/services-cache/thoughts";
import ThoughtTimeline from "@/lib/shared/utils/thoughts/ThoughtTimeline";

import CollectionBody from "../components/CollectionBody";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Thoughts",
};

export default async function ThoughtsPage() {
  const thoughts = await fetchCachedThoughts();
  const totalThoughts = thoughts.length;
  const totalCharacters = thoughts.reduce(
    (acc, t) => acc + t.content.length,
    0,
  );

  return (
    <CollectionBody
      title="Thoughts"
      description={
        <>
          A corner for my random thoughts and life fragments. Total{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {totalThoughts}
          </span>{" "}
          entries, approx{" "}
          <span className="font-bold text-zinc-900 dark:text-zinc-100">
            {totalCharacters}
          </span>{" "}
          characters.
        </>
      }
    >
      <ThoughtTimeline thoughts={thoughts} />
    </CollectionBody>
  );
}
