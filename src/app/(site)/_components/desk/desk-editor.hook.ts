import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

import { createDeskEditorAtoms } from "#lib/client/desk/desk-editor.atom";
import { updateDeskConfiguration } from "#lib/server/desk/desk-configuration.actions";
import type { AudioAsset } from "#lib/shared/audio/audio.schema";
import type { DeskConfiguration } from "#lib/shared/desk/desk-layout.schema";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

export function useDeskEditor(
  initial: DeskConfiguration,
  initialAudio: readonly AudioAsset[],
) {
  const [atoms] = useState(() =>
    createDeskEditorAtoms(initial, updateDeskConfiguration),
  );
  const desk = useAtomValue(atoms.effectiveDesk);
  const saving = useAtomValue(atoms.saving);
  const save = useSetAtom(atoms.save);
  const update = useSetAtom(atoms.change);
  const syncServer = useSetAtom(atoms.syncServer);
  const enter = useSetAtom(atoms.enter);
  const exit = useSetAtom(atoms.exit);
  const reset = useSetAtom(atoms.reset);
  const togglePreview = useSetAtom(atoms.togglePreview);
  const dirty = useAtomValue(atoms.dirty);
  const [audioAssets, setAudioAssets] = useState(initialAudio);
  const busy = saving.status === "saving";
  useEffect(() => {
    syncServer(initial);
  }, [initial, syncServer]);
  useEffect(() => {
    setAudioAssets((current) => [
      ...new Map(
        [...current, ...initialAudio].map((asset) => [asset.id, asset]),
      ).values(),
    ]);
  }, [initialAudio]);
  useEffect(() => {
    if (!busy && !dirty) return;
    const prevent = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [busy, dirty]);
  return {
    ...desk,
    audioAssets,
    setAudioAssets,
    busy,
    dirty,
    save: () => save(),
    notice: saving.status === "error" ? saving.error : "",
    enter,
    exit: () => {
      if (busy) return;
      if (dirty && !window.confirm(defaultDictionary.desk.layout.discard))
        return;
      exit();
    },
    change: async (next: DeskConfiguration) => update(next),
    reset,
    togglePreview,
  };
}
