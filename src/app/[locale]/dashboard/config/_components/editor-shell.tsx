"use client";

import { LoaderCircle, Save, Trash2, X } from "lucide-react";
import { type HTMLAttributes, useState } from "react";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/shared/utils";
import SegmentedToggle from "../../_components/ui/SegmentedToggle";

export type ConfigField = {
  key: string;
  title: string;
  description: string;
};

export interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  loading: boolean;
  onLocaleChange: (locale: string) => void;
  onDelete?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  onSave?: () => void | Promise<void>;
}

export default function EditorShell({
  title,
  loading,
  children,
  className,
  onLocaleChange,
  onDelete,
  onCancel,
  onSave,
}: Props) {
  const [locale, setLocale] = useState<string>("");

  const handleLocaleChange = (nextLocale: string) => {
    setLocale(nextLocale);
    onLocaleChange(nextLocale);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 overflow-hidden rounded-2xl border-zinc-200 bg-zinc-50 p-6 dark:bg-zinc-900",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <h2 className="truncate font-semibold text-2xl text-zinc-900 dark:text-zinc-100">
          {title}
        </h2>
        <SegmentedToggle
          value={locale}
          onChange={handleLocaleChange}
          options={[
            { value: "", label: "default" },
            { value: "zh_CN", label: "zh_CN" },
            { value: "en_US", label: "en_US" },
          ]}
          size="sm"
        />
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
          <div className="flex items-center gap-3 font-medium text-xl text-zinc-700 dark:text-zinc-200">
            <LoaderCircle className="h-6 w-6 animate-spin" />
            <span>Loading</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          type="button"
          onClick={onDelete}
          disabled={!onDelete}
          className="bg-red-100 text-red-700 hover:bg-red-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          disabled={!onCancel}
          className="bg-zinc-200 text-zinc-700 hover:bg-zinc-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          <X className="h-4 w-4" />
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onSave}
          disabled={!onSave}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
}
