"use client";

import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import ModalProvider, {
  useModal,
} from "@/app/[locale]/dashboard/_components/ModalProvider";
import Button from "@/components/ui/Button";
import Stack from "@/components/ui/Stack";
import { AUTH_CONFIG_KEYS } from "@/lib/shared/config/oauth";
import { SITE_CONFIG_KEYS } from "@/lib/shared/config/site";
import { cn } from "@/lib/shared/utils";

import DashboardShell from "../_components/ui/DashboardShell";
import AboutMe from "./_components/about-me";
import OauthProviders from "./_components/oauth-providers";
import PlaylistUrl from "./_components/playlist-url";

export type ConfigField = {
  key: string;
  title: string;
  description: string;
};

export const configFields = [
  {
    key: SITE_CONFIG_KEYS.aboutMe,
    title: "About Me",
    description: "Markdown intro shown on the home page.",
    Render: AboutMe,
  },
  {
    key: SITE_CONFIG_KEYS.playlistUrl,
    title: "Playlist URL",
    description: "Spotify playlist URL to show on the home page.",
    Render: PlaylistUrl,
  },
  {
    key: AUTH_CONFIG_KEYS.oauthProviders,
    title: "OAuth Providers",
    description:
      "Enable GitHub and Google login providers for the selected locale.",
    Render: OauthProviders,
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
        <div className="border-zinc-200 border-b px-5 py-4 dark:border-zinc-800">
          <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100">
            Config Items
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Select a config item and edit it in a modal.
          </p>
        </div>

        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {configFields.map((field) => (
            <button
              key={field.key}
              type="button"
              onClick={() => {
                const { Render, key, title } = field;
                open(<Render id={key} title={title} />);
              }}
              className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
            >
              <Stack y className="min-w-0 gap-1">
                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
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
  return (
    <ModalProvider>
      <ConfigPageContent />
    </ModalProvider>
  );
}
