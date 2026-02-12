"use client";

import { useEffect, useState } from "react";

import ThoughtTimeline from "@/components/ThoughtTimeline";
import { fetchThoughtsByBrowser } from "@/lib/client/services";
import { Thought } from "@/types";

import EditorProvider from "../components/EditorProvider";
import DashboardShell from "../components/ui/DashboardShell";
import NewThoughtButton from "./components/NewThoughtButton";
import StatusToggle from "./components/StatusToggle";
import ThoughtActions from "./components/ThoughtActions";
import ThoughtEditor from "./components/ThoughtEditor";

export default function ThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const data = await fetchThoughtsByBrowser();
        if (!isMounted) return;
        setThoughts(data);
        setError(false);
      } catch {
        if (!isMounted) return;
        setError(true);
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const syncStatus = (thoughtId: string, nextStatus: string) => {
    setThoughts((prev) =>
      prev.map((thought) =>
        thought.id === thoughtId ? { ...thought, status: nextStatus } : thought,
      ),
    );
  };

  return (
    <EditorProvider editorComponent={ThoughtEditor}>
      <DashboardShell
        title="Thoughts"
        loading={loading}
        error={error}
        optActions={<NewThoughtButton />}
        className="space-y-6"
      >
        <ThoughtTimeline
          thoughts={thoughts}
          renderMetaRight={(thought) => (
            <StatusToggle
              thoughtId={thought.id}
              status={thought.status ?? null}
              successCallback={syncStatus}
            />
          )}
          renderActions={(thought) => <ThoughtActions thoughtId={thought.id} />}
        />
      </DashboardShell>
    </EditorProvider>
  );
}
