"use client";

import { LoaderCircle, Save, Trash2, X } from "lucide-react";
import { useState, type HTMLAttributes } from "react";

import Button from "#components/ui/button.component";
import ModalPanel from "#components/ui/modal-panel.component";
import { useModal } from "#components/ui/modal-provider.component";
import { useDictionary } from "#dictionary";
import { cn } from "#lib/shared/utils";

export type ConfigField = {
  key: string;
  title: string;
  description: string;
};

export interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  loading: boolean;
  onDelete?: () => void | Promise<void>;
  onSave?: () => void | Promise<void>;
}

export default function EditorShell({
  title,
  loading,
  children,
  className,
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
    <ModalPanel
      className={cn("flex flex-col gap-4 overflow-hidden p-6", className)}
    >
      <div className="flex items-center gap-2">
        <h2 className="truncate text-2xl font-semibold text-text-primary">
          {title}
        </h2>
      </div>
      <div className="relative flex flex-1 overflow-hidden px-1">
        <div className={cn("flex flex-1 duration-300", loading && "opacity-0")}>
          {children}
        </div>
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center duration-300",
            loading ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <div className="flex items-center gap-3 text-xl font-medium text-text-secondary">
            <LoaderCircle className="h-6 w-6 animate-spin" />
            <span>{dictionary.common.loading}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          onClick={() => runAction("delete")}
          loading={pending === "delete"}
          disabled={!onDelete || loading || pending !== null}
          variant="danger"
        >
          <Trash2 className="h-4 w-4" />
          {dictionary.common.delete}
        </Button>
        <Button onClick={() => close()} variant="secondary">
          <X className="h-4 w-4" />
          {dictionary.common.cancel}
        </Button>
        <Button
          onClick={() => runAction("save")}
          loading={pending === "save"}
          disabled={!onSave || loading || pending !== null}
        >
          <Save className="h-4 w-4" />
          {dictionary.common.save}
        </Button>
      </div>
    </ModalPanel>
  );
}
