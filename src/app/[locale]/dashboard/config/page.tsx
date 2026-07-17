"use client";

import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";

import Button from "#components/ui/Button";
import { useModal } from "#components/ui/ModalProvider";
import Stack from "#components/ui/Stack";
import { cn } from "#lib/shared/utils";

import DashboardShell from "../_components/layout/DashboardShell";
import AboutMe from "./_components/AboutMe";
import OauthProviders from "./_components/OauthProviders";
import PlaylistUrl from "./_components/PlaylistUrl";
import RecentPlanEditor from "./_components/RecentPlanEditor";
import SiteInfo from "./_components/SiteInfo";

export type ConfigField = {
  key: string;
  title: string;
  description: string;
  render: () => ReactNode;
};

export const configFields = [
  {
    title: "Site Info",
    description:
      "Site title, hero copy, typewriter text, bio, and filing footer.",
    render: () => <SiteInfo />,
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
    description:
      "Enable GitHub and Google login providers for the selected locale.",
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
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Config Items
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Select a config item and edit it in a modal.
          </p>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {configFields.map((field) => (
            <button
              key={field.title}
              type="button"
              onClick={() => {
                open(field.render());
              }}
              aria-label={`Edit ${field.title}`}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <Stack y className="min-w-0 gap-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {field.title}
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  {field.description}
                </p>
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
