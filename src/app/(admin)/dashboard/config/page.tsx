"use client";

import * as stylex from "@stylexjs/stylex";
import { RefreshCw } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { toast } from "sonner";

import Button from "#components/ui/button.component";
import { useModal } from "#components/ui/modal-provider.component";
import Stack from "#components/ui/stack.component";
import { color, font, space, shape, motionToken } from "#design/tokens.stylex";

import DashboardShell from "../_components/layout/dashboard-shell.component";
import AboutMe from "./_components/about-me.component";
import DictionaryEditor from "./_components/dictionary-editor.component";
import OauthProviders from "./_components/oauth-providers.component";
import PlaylistUrl from "./_components/playlist-url.component";
import RecentPlanEditor from "./_components/recent-plan-editor.component";
const spin = stylex.keyframes({
  to: {
    rotate: "360deg",
  },
});
const styles = stylex.create({
  row: {
    alignItems: "center",
    gap: space.xs,
  },
  refreshCw: {
    height: space.md,
    width: space.md,
  },
  refreshCw2: {
    animationName: spin,
    animationDuration: "1s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  container: {
    overflow: "hidden",
    borderTopLeftRadius: shape.card,
    borderTopRightRadius: shape.card,
    borderBottomRightRadius: shape.card,
    borderBottomLeftRadius: shape.card,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: color.surface,
  },
  container2: {
    borderBottomWidth: shape.fine,
    borderBottomStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: space.md,
    paddingBottom: space.md,
  },
  heading: {
    fontSize: font.navigation,
    lineHeight: 1.5,
    fontWeight: font.semibold,
    color: color.text,
  },
  description: {
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.muted,
  },
  button: {
    display: "flex",
    width: "100%",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
    paddingLeft: "20px",
    paddingRight: "20px",
    paddingTop: space.md,
    paddingBottom: space.md,
    textAlign: "left",
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    backgroundColor: {
      default: null,
      ":hover": color.surfaceHover,
    },
  },
  column: {
    minWidth: "0px",
    gap: space.xxs,
  },
  description2: {
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
    color: color.text,
  },
});
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
        <Stack x xstyle={styles.row}>
          <Button onClick={handleRefreshAllCaches} disabled={refreshingCache}>
            <RefreshCw
              {...stylex.props([
                styles.refreshCw,
                refreshingCache && styles.refreshCw2,
              ])}
            />
            {refreshingCache ? "Refreshing..." : "Refresh All Caches"}
          </Button>
        </Stack>
      }
    >
      <div {...stylex.props(styles.container)}>
        <div {...stylex.props(styles.container2)}>
          <h3 {...stylex.props(styles.heading)}>Config Items</h3>
          <p {...stylex.props(styles.description)}>
            Select a config item and edit it in a modal.
          </p>
        </div>
        <Stack y divide>
          {configFields.map((field) => (
            <button
              type="button"
              key={field.title}
              onClick={() => {
                open(field.render());
              }}
              aria-label={`Edit ${field.title}`}
              {...stylex.props(styles.button)}
            >
              <Stack y xstyle={styles.column}>
                <p {...stylex.props(styles.description2)}>{field.title}</p>
                <p {...stylex.props(styles.description)}>{field.description}</p>
              </Stack>
            </button>
          ))}
        </Stack>
      </div>
    </DashboardShell>
  );
}
export default function DashboardPage() {
  return <ConfigPageContent />;
}
