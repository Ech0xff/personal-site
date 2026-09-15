import * as stylex from "@stylexjs/stylex";
import { Link as LinkIcon } from "lucide-react";
import { useContext } from "react";

import type { StyleInput } from "#design/style.type";
import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { feedback } from "../_design/object-feedback.stylex";
import { DeskItemContext } from "./desk/desk-item.context";
export function ObjectFeedback({
  label,
  navigable = false,
  round = false,
  xstyle,
}: Readonly<{
  label: string;
  navigable?: boolean;
  round?: boolean;
  xstyle?: StyleInput;
}>) {
  const item = useContext(DeskItemContext);
  if (item?.editing) return null;
  return (
    <span
      data-object-feedback
      {...stylex.props(
        feedback.frame,
        round && feedback.round,
        item?.emphasized && feedback.visible,
        xstyle,
      )}
    >
      <button
        type="button"
        data-item-drag-handle
        disabled={!item?.draggable}
        aria-label={`${defaultDictionary.desk.layout.move} ${label}`}
        title={`${defaultDictionary.desk.layout.holdToMove} ${label}`}
        {...stylex.props(feedback.label)}
      >
        {label}
        {navigable && <LinkIcon size={11} aria-hidden />}
      </button>
    </span>
  );
}
