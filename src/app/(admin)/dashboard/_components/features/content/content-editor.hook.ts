import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { loadContent, saveContent } from "#lib/server/content/content.actions";
import {
  contentInputSchema,
  type ContentInput,
  type ContentKind,
} from "#lib/shared/content/content.schema";

type EditorState =
  | { type: "loading" }
  | { type: "error"; message: string }
  | { type: "ready"; form: ContentInput };
export function useContentEditor(
  kind: ContentKind,
  id: string | undefined,
  onSaved: () => void,
) {
  const [state, setState] = useState<EditorState>({ type: "loading" });
  const [error, setError] = useState("");
  const [unauthorized, setUnauthorized] = useState(false);
  const [uploads, setUploads] = useState(0);
  const [pending, startTransition] = useTransition();
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    setState({ type: "loading" });
    const load = async () => {
      if (!id) {
        setState({
          type: "ready",
          form: {
            kind,
            title: "",
            content:
              kind !== "posts"
                ? []
                : [
                    { type: "heading", props: { level: 1 }, content: "" },
                    { type: "paragraph", content: "" },
                  ],
            status: "hide",
            color: "#3b82f6",
            published_at: new Date().toISOString(),
          },
        });
        return;
      }
      try {
        const result = await loadContent({ kind, id });
        if (!active) return;
        setState(
          result.ok
            ? { type: "ready", form: result.data }
            : { type: "error", message: result.error },
        );
      } catch {
        if (active)
          setState({
            type: "error",
            message: "Could not load content. Please try again.",
          });
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, [kind, id, retry]);
  const update = useCallback(
    (patch: Partial<ContentInput>) =>
      setState((previous) =>
        previous.type === "ready"
          ? { type: "ready", form: { ...previous.form, ...patch } }
          : previous,
      ),
    [],
  );
  const changeUploads = useCallback(
    (delta: number) => setUploads((previous) => Math.max(0, previous + delta)),
    [],
  );
  const save = () => {
    if (state.type !== "ready" || uploads || pending) return;
    const parsed = contentInputSchema.safeParse(state.form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check your content.");
      return;
    }
    setError("");
    startTransition(async () => {
      try {
        const result = await saveContent(parsed.data);
        if (!result.ok) {
          setError(result.error);
          setUnauthorized(Boolean(result.unauthorized));
          return;
        }
        toast.success("Content saved.");
        onSaved();
      } catch {
        setError(
          "Could not save. Your changes are still here; please try again.",
        );
      }
    });
  };
  return {
    state,
    error,
    unauthorized,
    uploads,
    changeUploads,
    pending,
    update,
    save,
    retry: () => setRetry((value) => value + 1),
  };
}
