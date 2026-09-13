import * as stylex from "@stylexjs/stylex";
import { useAtom } from "jotai";

import { foundation } from "../_design/foundation.style";
import { deskLikedAtom } from "./desk-preferences.atom";
import { deskStatistics, deskTotalVisits } from "./display-content.const";
import { panel } from "./display-panel.style";

export function DisplayStats() {
  const [liked, setLiked] = useAtom(deskLikedAtom);
  return (
    <>
      <h2 {...stylex.props(panel.title)}>At a glance</h2>
      <dl {...stylex.props(panel.rows)}>
        {deskStatistics.map((item) => (
          <div key={item.label} {...stylex.props(panel.row)}>
            <dt>{item.label}</dt>
            <dd {...stylex.props(panel.value)}>{item.value}</dd>
          </div>
        ))}
      </dl>
      <div {...stylex.props(panel.actions)}>
        <button
          type="button"
          aria-pressed={liked}
          onClick={() => setLiked((value) => !value)}
          {...stylex.props(panel.button, foundation.focus)}
        >
          {liked ? "♥" : "♡"} {83 + Number(liked)} likes
        </button>
        <span
          aria-label={`${deskTotalVisits.toLocaleString("en-US")} total visits`}
          title="Total visits"
          {...stylex.props(panel.metric)}
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            {...stylex.props(panel.fieldIcon)}
          >
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {deskTotalVisits.toLocaleString("en-US")}
        </span>
      </div>
    </>
  );
}
