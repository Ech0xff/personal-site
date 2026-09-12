"use client";

import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";

import Button from "#components/ui/button.component";
import { useModal } from "#components/ui/modal-provider.component";
import Stack from "#components/ui/stack.component";
import { cn } from "#lib/shared/utils";

import DashboardShell from "../_components/layout/dashboard-shell.component";
import AboutMe from "./_components/about-me.component";
import DictionaryEditor from "./_components/dictionary-editor.component";
import OauthProviders from "./_components/oauth-providers.component";
import PlaylistUrl from "./_components/playlist-url.component";
import RecentPlanEditor from "./_components/recent-plan-editor.component";

export type ConfigField = {
  key: string;
  title: string;
  description: string;
  render: () => ReactNode;
};

const configFields = [
  {
    title: "Dictionary",
    description:
      "Customize site metadata, homepage, navigation, and interface copy.",
    render: () => <DictionaryEditor />,
  },
  {
    title: "About Me",
    description: "Markdown intro shown on the home page.",
    render: () => <AboutMe />,
  },
  {
    title: "Recent Plans",
    description: "Task list and progress status shown under About Me.",
    render: () => <RecentPlanEditor />,
  },
  {
    title: "Playlist URL",
    description: "Spotify playlist URL to show on the home page.",
    render: () => <PlaylistUrl />,
  },
  {
    title: "OAuth Providers",
    description: "Enable GitHub and Google login providers globally.",
    render: () => <OauthProviders />,
  },
];

function ConfigPageContent() {
  const { open } = useModal();
  const [refreshingCache, setRefreshingCache] = useState(false);
  const handleRefreshAllCaches = async () => {
    setRefreshingCache(true);
    try {
      const response = await fetch("/api/admin/cache/revalidate-all", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to refresh caches");
      }
      toast.success("All caches refreshed.");
    } catch {
      toast.error("Failed to refresh caches.");
    } finally {
      setRefreshingCache(false);
    }
  };

  return (
    <DashboardShell
      title="Config"
      optActions={
        <Stack x className="items-center gap-2">
          <Button onClick={handleRefreshAllCaches} disabled={refreshingCache}>
            <RefreshCw
              className={cn("h-4 w-4", refreshingCache && "animate-spin")}
            />
            {refreshingCache ? "Refreshing..." : "Refresh All Caches"}
          </Button>
        </Stack>
      }
    >
      <div className="overflow-hidden rounded-xl border border-border-default bg-surface-card">
        <div className="border-b border-border-default px-5 py-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Config Items
          </h3>
          <p className="text-sm text-text-muted">
            Select a config item and edit it in a modal.
          </p>
        </div>
        <div className="divide-y divide-border-default">
          {configFields.map((field) => (
            <button
              type="button"
              key={field.title}
              onClick={() => {
                open(field.render());
              }}
              aria-label={`Edit ${field.title}`}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-surface-hover"
            >
              <Stack y className="min-w-0 gap-1">
                <p className="text-sm font-medium text-text-primary">
                  {field.title}
                </p>
                <p className="text-sm text-text-muted">{field.description}</p>
              </Stack>
            </button>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

export default function DashboardPage() {
  return <ConfigPageContent />;
}
