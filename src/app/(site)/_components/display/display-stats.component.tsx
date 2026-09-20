"use client";
import * as stylex from "@stylexjs/stylex";
import { Eye, Link as LinkIcon } from "lucide-react";

import { defaultDictionary } from "#lib/shared/dictionary/dictionary.const";

import { foundation } from "../../_design/foundation.style";
import { DeskLink } from "../layout/desk-navigation.component";
import { DisplayLoading } from "./display-loading.component";
import { panel } from "./display-panel.style";
import { useDisplayStats } from "./display-stats.hook";
export function DisplayStats() {
  const { stats, loading, notice, liked, pending, like, retry } =
    useDisplayStats();
  if (loading) return <DisplayLoading />;
  return (
    <>
      <h2 {...stylex.props(panel.title)}>{copy.statsTitle}</h2>
      {notice && (
        <output>
          {notice}{" "}
          <button
            type="button"
            onClick={retry}
            {...stylex.props(panel.button, foundation.focus)}
          >
            {copy.retry}
          </button>
        </output>
      )}
      <dl {...stylex.props(panel.rows)}>
        {(["posts", "thoughts"] as const).map((kind) => (
          <div key={kind} {...stylex.props(panel.row)}>
            <dt>
              <DeskLink
                href={`/${kind}`}
                {...stylex.props(panel.statLink, foundation.focus)}
              >
                {kind[0].toUpperCase() + kind.slice(1)}{" "}
                <LinkIcon size={12} aria-hidden />
              </DeskLink>
            </dt>
            <dd {...stylex.props(panel.value)}>{stats?.[kind] ?? "—"}</dd>
          </div>
        ))}
      </dl>
      <div {...stylex.props(panel.actions)}>
        <button
          type="button"
          disabled={liked || pending}
          aria-pressed={liked}
          onClick={() => void like()}
          {...stylex.props(panel.button, foundation.focus)}
        >
          {liked ? "♥" : "♡"} {stats?.likes ?? "—"} likes
        </button>
        <span
          title="Total visits"
          aria-label={`${stats?.visits ?? "Unknown"} total visits`}
          {...stylex.props(panel.metric)}
        >
          <Eye size={16} aria-hidden />
          {stats?.visits.toLocaleString("en-US") ?? "—"}
        </span>
      </div>
    </>
  );
}

const copy = defaultDictionary.desk;
