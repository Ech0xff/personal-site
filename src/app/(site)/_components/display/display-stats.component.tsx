import * as stylex from "@stylexjs/stylex";

import { readPublicCounts } from "#lib/server/content/public-content.service";

import { deskTotalVisits } from "./display-content.const";
import { DisplayLike } from "./display-like.component";
import { panel } from "./display-panel.style";

export async function DisplayStats() {
  const statistics = await readPublicCounts().catch(() => null);
  return (
    <>
      <h2 {...stylex.props(panel.title)}>At a glance</h2>
      {statistics === null && <output>Counts unavailable.</output>}
      <dl {...stylex.props(panel.rows)}>
        {(
          statistics ?? [
            { label: "Posts", value: "—" },
            { label: "Thoughts", value: "—" },
          ]
        ).map((item) => (
          <div key={item.label} {...stylex.props(panel.row)}>
            <dt>{item.label}</dt>
            <dd {...stylex.props(panel.value)}>{item.value}</dd>
          </div>
        ))}
      </dl>
      <div {...stylex.props(panel.actions)}>
        <DisplayLike />
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
