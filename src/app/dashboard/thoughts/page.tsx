import ThoughtTimeline from "@/components/ThoughtTimeline";
import { getCachedThoughts } from "@/lib/cache/thoughts";

import EditorProvider from "../components/EditorProvider";
import HeaderSection from "../components/HeaderSection";
import NewThoughtButton from "./components/NewThoughtButton";
import StatusToggle from "./components/StatusToggle";
import ThoughtActions from "./components/ThoughtActions";
import ThoughtEditor from "./components/ThoughtEditor";

export default async function ThoughtsPage() {
  const thoughts = await getCachedThoughts();

  return (
    <EditorProvider editorComponent={ThoughtEditor}>
      <div className="space-y-6">
        <HeaderSection title="Thoughts">
          <NewThoughtButton />
        </HeaderSection>

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
      </div>
    </EditorProvider>
  );
}
