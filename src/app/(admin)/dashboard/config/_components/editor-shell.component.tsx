"use client";

import * as stylex from "@stylexjs/stylex";
import { LoaderCircle, Save, Trash2, X } from "lucide-react";
import { useState, type HTMLAttributes } from "react";

import Button from "#components/ui/button.component";
import ModalPanel from "#components/ui/modal-panel.component";
import { useModal } from "#components/ui/modal-provider.component";
import type { StyleInput } from "#design/style.type";
import { color, font, space, motionToken } from "#design/tokens.stylex";
import { useDictionary } from "#dictionary";
const spin = stylex.keyframes({
  to: {
    rotate: "360deg",
  },
});
const styles = stylex.create({
  modalPanel: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    overflow: "hidden",
    paddingTop: space.lg,
    paddingRight: space.lg,
    paddingBottom: space.lg,
    paddingLeft: space.lg,
  },
  container: {
    display: "flex",
    alignItems: "center",
    gap: space.xs,
  },
  heading: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: font.subtitle,
    lineHeight: 1.5,
    fontWeight: font.semibold,
    color: color.text,
  },
  container2: {
    position: "relative",
    display: "flex",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    overflow: "hidden",
    paddingLeft: space.xxs,
    paddingRight: space.xxs,
  },
  container3: {
    display: "flex",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    transitionDuration: motionToken.fast,
  },
  container4: {
    opacity: 0,
  },
  container5: {
    position: "absolute",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transitionDuration: motionToken.fast,
  },
  container6: {
    opacity: 1,
  },
  container7: {
    pointerEvents: "none",
    opacity: 0,
  },
  container8: {
    display: "flex",
    alignItems: "center",
    gap: space.sm,
    fontSize: font.large,
    lineHeight: 1.5,
    fontWeight: font.medium,
    color: color.secondary,
  },
  icon: {
    height: space.lg,
    width: space.lg,
    animationName: spin,
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  container9: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: space.xs,
  },
  icon2: {
    height: space.md,
    width: space.md,
  },
});
export type ConfigField = {
  key: string;
  xstyle?: StyleInput;
  title: string;
  description: string;
};
export interface Props extends HTMLAttributes<HTMLDivElement> {
  xstyle?: StyleInput;
  title: string;
  loading: boolean;
  onDelete?: () => void | Promise<void>;
  onSave?: () => void | Promise<void>;
}
export default function EditorShell({
  title,
  loading,
  children,
  xstyle,
  onDelete,
  onSave,
}: Props) {
  const [pending, setPending] = useState<"save" | "delete" | null>(null);
  const runAction = async (action: "save" | "delete") => {
    if (pending || loading) return;
    setPending(action);
    try {
      await (action === "save" ? onSave?.() : onDelete?.());
    } finally {
      setPending(null);
    }
  };
  const dictionary = useDictionary();
  const { close } = useModal();
  return (
    <ModalPanel xstyle={[styles.modalPanel, xstyle]}>
      <div {...stylex.props(styles.container)}>
        <h2 {...stylex.props(styles.heading)}>{title}</h2>
      </div>
      <div {...stylex.props(styles.container2)}>
        <div
          {...stylex.props([styles.container3, loading && styles.container4])}
        >
          {children}
        </div>
        <div
          {...stylex.props([
            styles.container5,
            loading ? styles.container6 : styles.container7,
          ])}
        >
          <div {...stylex.props(styles.container8)}>
            <LoaderCircle {...stylex.props(styles.icon)} />
            <span>{dictionary.common.loading}</span>
          </div>
        </div>
      </div>
      <div {...stylex.props(styles.container9)}>
        <Button
          onClick={() => runAction("delete")}
          loading={pending === "delete"}
          disabled={!onDelete || loading || pending !== null}
          variant="danger"
        >
          <Trash2 {...stylex.props(styles.icon2)} />
          {dictionary.common.delete}
        </Button>
        <Button onClick={() => close()} variant="secondary">
          <X {...stylex.props(styles.icon2)} />
          {dictionary.common.cancel}
        </Button>
        <Button
          onClick={() => runAction("save")}
          loading={pending === "save"}
          disabled={!onSave || loading || pending !== null}
        >
          <Save {...stylex.props(styles.icon2)} />
          {dictionary.common.save}
        </Button>
      </div>
    </ModalPanel>
  );
}
