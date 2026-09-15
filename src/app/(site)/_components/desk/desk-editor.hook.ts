import { useEffect, useState } from "react";

import {
  loadDeskWorkspace,
  updateDeskConfiguration,
} from "#lib/server/desk/desk-configuration.actions";
import type {
  DeskBreakpoint,
  DeskConfiguration,
} from "#lib/shared/desk/desk-layout.schema";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

type Editing = Readonly<{
  history: readonly DeskConfiguration[];
  index: number;
  saved: DeskConfiguration;
  revision: number;
  preview: DeskConfiguration | null;
}>;
export function useDeskEditor(initial: DeskConfiguration) {
  const [published, setPublished] = useState(initial);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const configuration = editing?.history[editing.index] ?? published;
  const dirty =
    editing !== null &&
    JSON.stringify(configuration) !== JSON.stringify(editing.saved);
  useEffect(() => {
    setPublished(initial);
  }, [initial]);
  useEffect(() => {
    if (!dirty) return;
    const prevent = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [dirty]);
  const enter = async () => {
    setBusy(true);
    setNotice("");
    try {
      const result = await loadDeskWorkspace();
      if (!result.ok) {
        setNotice(result.error);
        return;
      }
      const draft = result.data.draft ?? result.data.published ?? published;
      setEditing({
        history: [draft],
        index: 0,
        saved: draft,
        revision: result.data.revision,
        preview: null,
      });
    } catch {
      setNotice(copy.loadFailed);
    } finally {
      setBusy(false);
    }
  };
  const change = (next: DeskConfiguration) =>
    setEditing((state) =>
      !state
        ? state
        : state.preview
          ? { ...state, preview: next }
          : {
              ...state,
              history: [...state.history.slice(0, state.index + 1), next],
              index: state.index + 1,
            },
    );
  const save = async (publish: boolean) => {
    if (!editing || busy) return;
    setBusy(true);
    setNotice("");
    try {
      const result = await updateDeskConfiguration({
        revision: editing.revision,
        configuration,
        publish,
      });
      if (!result.ok) {
        setNotice(result.error);
        return;
      }
      setEditing((state) =>
        state
          ? { ...state, saved: configuration, revision: result.data.revision }
          : state,
      );
      if (publish) setPublished(configuration);
      setNotice(publish ? copy.published : copy.draftSaved);
    } catch {
      setNotice(copy.saveFailed);
    } finally {
      setBusy(false);
    }
  };
  const exit = () => {
    if (busy || (dirty && !window.confirm(copy.discard))) return;
    setEditing(null);
    setNotice("");
  };
  return {
    configuration: editing?.preview ?? configuration,
    editing: editing !== null,
    preview: Boolean(editing?.preview),
    busy,
    notice,
    dirty,
    enter,
    exit,
    change,
    reset: (breakpoint: DeskBreakpoint) => {
      if (!editing || busy || editing.preview) return;
      const layout = published.layouts[breakpoint];
      if (
        JSON.stringify(configuration.layouts[breakpoint]) ===
        JSON.stringify(layout)
      )
        return;
      change({
        ...configuration,
        layouts: { ...configuration.layouts, [breakpoint]: layout },
      });
      setNotice("");
    },
    save,
    undo: () =>
      setEditing((state) =>
        state ? { ...state, index: Math.max(0, state.index - 1) } : state,
      ),
    redo: () =>
      setEditing((state) =>
        state
          ? {
              ...state,
              index: Math.min(state.history.length - 1, state.index + 1),
            }
          : state,
      ),
    canUndo: editing !== null && editing.index > 0,
    canRedo: editing !== null && editing.index < editing.history.length - 1,
    togglePreview: () =>
      setEditing((state) =>
        state
          ? {
              ...state,
              preview: state.preview ? null : state.history[state.index],
            }
          : state,
      ),
  };
}

const copy = defaultDictionary.desk.layout;
