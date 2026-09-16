"use client";
import * as stylex from "@stylexjs/stylex";
import { useAtomValue } from "jotai";
import { LayoutDashboard, RotateCcw, Shuffle } from "lucide-react";

import { isAdminAtom } from "#lib/client/auth/admin-ui.atom";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { DeskAction } from "../desk-action.component";
import { panel } from "./display-panel.style";
export function DisplaySettings({
  enter,
  busy,
  notice,
  reset,
  shuffle,
}: Readonly<{
  enter: () => void;
  busy: boolean;
  notice: string;
  reset: () => void;
  shuffle: () => void;
}>) {
  const allowed = useAtomValue(isAdminAtom);
  return (
    <div>
      <DeskAction
        label={defaultDictionary.desk.layout.shuffle}
        onClick={shuffle}
        disabled={busy}
        display
      >
        <Shuffle size={20} strokeWidth={1.6} aria-hidden />
      </DeskAction>
      <DeskAction
        label={defaultDictionary.desk.resetLayout}
        onClick={reset}
        display
      >
        <RotateCcw size={20} strokeWidth={1.6} aria-hidden />
      </DeskAction>
      {allowed && (
        <>
          <DeskAction
            label={defaultDictionary.desk.editDesk}
            disabled={busy}
            onClick={enter}
            display
          >
            <LayoutDashboard size={20} strokeWidth={1.6} aria-hidden />
          </DeskAction>
          {notice && <output {...stylex.props(panel.notice)}>{notice}</output>}
        </>
      )}
    </div>
  );
}
