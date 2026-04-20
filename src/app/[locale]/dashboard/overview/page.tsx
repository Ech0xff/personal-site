"use client";

import { RefreshCw } from "lucide-react";

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
      title="Overview"
      loading={loading}
      error={error}
      optActions={
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
      }
    >
      <Stack y className="min-h-0 flex-1 gap-4">
        <Stack
          className="items-start justify-between gap-3 sm:flex-row sm:items-center"
          y
        >
          <Stack y className="min-h-15 gap-1">
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
              Config JSON
            </h3>
            {validationError && (
              <p className={cn("shrink-0 text-red-500 text-sm")}>
                {validationError}
              </p>
            )}
          </Stack>

          <Stack x className="gap-2">
            <Button
              type="button"
              onClick={handleFormat}
              disabled={Boolean(validationError)}
              className="bg-zinc-900 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Format
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={Boolean(validationError) || saving}
              className="disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Config"}
            </Button>
          </Stack>
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
