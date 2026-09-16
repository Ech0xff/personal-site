import { isEqual } from "es-toolkit";
import { atom } from "jotai";
import { startTransition } from "react";

import type {
  DeskBreakpoint,
  DeskConfiguration,
} from "#lib/shared/desk/desk-layout.schema";

import { personalDeskLayoutsAtom } from "./desk-layout.atom";

type DeskEditorState =
  | { mode: "view" }
  | { mode: "edit"; draft: DeskConfiguration; preview: boolean };

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
  const serverSnapshot = atom(initial);
  const editorState = atom<DeskEditorState>({ mode: "view" });
  const saving = atom<SaveState>({ status: "idle" });
  const effectiveDesk = atom((get) => {
    const state = get(editorState);
    return {
      configuration: state.mode === "edit" ? state.draft : get(serverSnapshot),
      personalLayouts:
        state.mode === "view" ? get(personalDeskLayoutsAtom) : undefined,
      editing: state.mode === "edit",
      preview: state.mode === "edit" && state.preview,
    };
  });
  const dirty = atom((get) => {
    const state = get(editorState);
    return state.mode === "edit" && !isEqual(state.draft, get(serverSnapshot));
  });
  const syncServer = atom(null, (get, set, next: DeskConfiguration) => {
    if (get(saving).status !== "saving") set(serverSnapshot, next);
  });
  const enter = atom(null, (get, set) => {
    if (get(editorState).mode === "view") {
      set(editorState, {
        mode: "edit",
        draft: get(serverSnapshot),
        preview: false,
      });
    }
  });
  const exit = atom(null, (get, set) => {
    if (get(saving).status === "saving") return;
    set(editorState, { mode: "view" });
    set(saving, { status: "idle" });
  });
  const togglePreview = atom(null, (get, set) => {
    const state = get(editorState);
    if (state.mode !== "edit" || get(saving).status === "saving") return;
    set(editorState, { ...state, preview: !state.preview });
  });
  const change = atom(null, (get, set, next: DeskConfiguration): boolean => {
    const state = get(editorState);
    if (state.mode !== "edit" || get(saving).status === "saving") return false;
    if (isEqual(next, state.draft)) return true;
    set(editorState, { ...state, draft: next });
    set(saving, { status: "idle" });
    return true;
  });
  const reset = atom(null, (get, set, breakpoint: DeskBreakpoint) => {
    const state = get(editorState);
    if (state.mode !== "edit" || state.preview) return;
    set(change, {
      ...state.draft,
      layouts: {
        ...state.draft.layouts,
        [breakpoint]: get(serverSnapshot).layouts[breakpoint],
      },
    });
  });
  const save = atom(null, async (get, set): Promise<boolean> => {
    const state = get(editorState);
    if (state.mode !== "edit" || state.preview) return false;
    if (get(saving).status === "saving") return false;
    if (!get(dirty)) return true;
    const next = state.draft;
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
      set(serverSnapshot, result.data);
      set(editorState, { ...state, draft: result.data });
      set(saving, { status: "idle" });
      return true;
    } catch {
      set(saving, {
        status: "error",
        error: "Could not save your changes. Please try again.",
      });
      return false;
    }
  });
  return {
    serverSnapshot,
    editorState,
    effectiveDesk,
    saving,
    dirty,
    syncServer,
    enter,
    exit,
    togglePreview,
    reset,
    change,
    save,
  };
}
