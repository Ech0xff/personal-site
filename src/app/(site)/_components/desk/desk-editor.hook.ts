import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useEffectEvent, useState } from "react";

import { createDeskEditorAtoms } from "#lib/client/desk/desk-editor.atom";
import { updateDeskConfiguration } from "#lib/server/desk/desk-configuration.actions";
import type { AudioAsset } from "#lib/shared/audio/audio.schema";
import type {
  DeskBreakpoint,
  DeskConfiguration,
} from "#lib/shared/desk/desk-layout.schema";

export function useDeskEditor(
  initial: DeskConfiguration,
  initialAudio: readonly AudioAsset[],
) {
  const [atoms] = useState(() =>
    createDeskEditorAtoms(initial, updateDeskConfiguration),
  );
  const [configuration, setConfiguration] = useAtom(atoms.configuration);
  const [history, setHistory] = useAtom(atoms.history);
  const saving = useAtomValue(atoms.saving);
  const save = useSetAtom(atoms.save);
  const [audioAssets, setAudioAssets] = useState(initialAudio);
  const [baseline, setBaseline] = useState<DeskConfiguration | null>(null);
  const [preview, setPreview] = useState<DeskConfiguration | null>(null);
  const busy = saving.status === "saving";
  const syncInitial = useEffectEvent((next: DeskConfiguration) => {
    if (!baseline && !busy) {
      setConfiguration(next);
      setHistory({ entries: [next], index: 0 });
    }
  });
  useEffect(() => {
    syncInitial(initial);
  }, [initial]);
  useEffect(() => {
    setAudioAssets((current) => [
      ...new Map(
        [...current, ...initialAudio].map((asset) => [asset.id, asset]),
      ).values(),
    ]);
  }, [initialAudio]);
  useEffect(() => {
    if (!busy) return;
    const prevent = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [busy]);
  const change = async (next: DeskConfiguration) => {
    if (preview) {
      setPreview(next);
      return true;
    }
    return save(next);
  };
  return {
    configuration: preview ?? configuration,
    audioAssets,
    setAudioAssets,
    editing: baseline !== null,
    preview: preview !== null,
    busy,
    notice: saving.status === "error" ? saving.error : "",
    enter: () => {
      setBaseline(configuration);
      setHistory({ entries: [configuration], index: 0 });
    },
    exit: () => {
      if (busy) return;
      setPreview(null);
      setBaseline(null);
    },
    change,
    reset: (breakpoint: DeskBreakpoint) => {
      if (!baseline || busy || preview) return;
      void save({
        ...configuration,
        layouts: {
          ...configuration.layouts,
          [breakpoint]: baseline.layouts[breakpoint],
        },
      });
    },
    undo: () => {
      if (history.index > 0)
        void save(history.entries[history.index - 1], history.index - 1);
    },
    redo: () => {
      if (history.index < history.entries.length - 1)
        void save(history.entries[history.index + 1], history.index + 1);
    },
    canUndo: history.index > 0,
    canRedo: history.index < history.entries.length - 1,
    togglePreview: () =>
      setPreview((current) => (current ? null : configuration)),
  };
}
