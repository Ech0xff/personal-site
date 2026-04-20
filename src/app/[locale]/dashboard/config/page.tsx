"use client";

import { Braces, RefreshCw, Save } from "lucide-react";

import Button from "@/components/ui/Button";
import CodeMirrorEditor from "@/components/ui/CodeMirrorEditor";
import Stack from "@/components/ui/Stack";
import { cn } from "@/lib/shared/utils";

import DashboardShell from "../_components/ui/DashboardShell";
import { useHooks } from "./use-hooks";

export default function DashboardPage() {
  const {
    loading,
    error,
    configScope,
    setConfigScope,
    configText,
    setConfigText,
    validationError,
    saving,
    handleRefreshAllCaches,
    refreshingCache,
    handleFormat,
    handleSave,
    configEditorExtensions,
  } = useHooks();

  return (
    <DashboardShell
      title="Config"
      loading={loading}
      error={error}
      optActions={
        <Stack x className="items-center gap-2">
          <Stack
            x
            className="items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800"
          >
            {[
              ["common", "common"],
              ["zh_CN", "zh_CN"],
              ["en_US", "en_US"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setConfigScope(value as "common" | "zh_CN" | "en_US")
                }
                className={cn(
                  "rounded-md px-3 py-1.5 font-medium text-sm transition-colors",
                  configScope === value
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-950 dark:text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
                )}
              >
                {label}
              </button>
            ))}
          </Stack>
          <Button
            type="button"
            onClick={handleFormat}
            disabled={Boolean(validationError)}
            className="bg-zinc-900 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            <Braces className="h-4 w-4" />
            Format
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={Boolean(validationError) || saving}
            className="disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Config"}
          </Button>
          <Button
            type="button"
            onClick={handleRefreshAllCaches}
            disabled={refreshingCache}
            className="disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={cn("h-4 w-4", refreshingCache && "animate-spin")}
            />
            {refreshingCache ? "Refreshing..." : "Refresh All Caches"}
          </Button>
        </Stack>
      }
    >
      <Stack y className="min-h-0 flex-1 gap-4">
        <Stack y className="min-h-5 gap-1">
          {validationError && (
            <p className={cn("shrink-0 text-red-500 text-sm")}>
              {validationError}
            </p>
          )}
        </Stack>
        <CodeMirrorEditor
          value={configText}
          extensions={configEditorExtensions}
          onChange={setConfigText}
        />
      </Stack>
    </DashboardShell>
  );
}
