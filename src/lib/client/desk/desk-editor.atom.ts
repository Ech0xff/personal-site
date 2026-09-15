import { isEqual } from "es-toolkit";
import { atom } from "jotai";
import { startTransition } from "react";

import type { DeskConfiguration } from "#lib/shared/desk/desk-layout.schema";

type SaveResult = Readonly<
  { ok: true; data: DeskConfiguration } | { ok: false; error: string }
>;
type SaveState = Readonly<
  { status: "idle" } | { status: "saving" } | { status: "error"; error: string }
>;

/** Each desk owns its atoms; server renders never share mutable editor state. */
export function createDeskEditorAtoms(
  initial: DeskConfiguration,
  persist: (configuration: DeskConfiguration) => Promise<SaveResult>,
) {
  const configuration = atom(initial);
  const history = atom({ entries: [initial], index: 0 });
  const saving = atom<SaveState>({ status: "idle" });
  const save = atom(
    null,
    async (
      get,
      set,
      next: DeskConfiguration,
      historyIndex?: number,
    ): Promise<boolean> => {
      if (get(saving).status === "saving") return false;
      if (isEqual(next, get(configuration))) {
        set(saving, { status: "idle" });
        return true;
      }
      set(saving, { status: "saving" });
      try {
        const result = await new Promise<SaveResult>((resolve, reject) => {
          startTransition(() => {
            void persist(next).then(resolve, reject);
          });
        });
        if (!result.ok) {
          set(saving, { status: "error", error: result.error });
          return false;
        }
        const current = get(history);
        set(configuration, result.data);
        set(
          history,
          historyIndex === undefined
            ? {
                entries: [
                  ...current.entries.slice(0, current.index + 1),
                  result.data,
                ],
                index: current.index + 1,
              }
            : {
                entries: current.entries.map((entry, index) =>
                  index === historyIndex ? result.data : entry,
                ),
                index: historyIndex,
              },
        );
        set(saving, { status: "idle" });
        return true;
      } catch {
        set(saving, {
          status: "error",
          error: "Could not save your changes. Please try again.",
        });
        return false;
      }
    },
  );
  return { configuration, history, saving, save };
}
