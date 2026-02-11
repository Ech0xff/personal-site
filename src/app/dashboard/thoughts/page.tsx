"use client";

import { useEffect, useState } from "react";

import ThoughtTimeline from "@/components/ThoughtTimeline";
import { getDashboardThoughtsClient } from "@/lib/client/data";
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
        const data = await getDashboardThoughtsClient();
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
            />
          )}
          renderActions={(thought) => <ThoughtActions thoughtId={thought.id} />}
        />
      </DashboardShell>
    </EditorProvider>
  );
}
