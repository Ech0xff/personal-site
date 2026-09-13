import * as stylex from "@stylexjs/stylex";

import type { GuestbookEntry } from "./display-content.schema";
import { panel } from "./display-panel.style";
import { GuestbookAvatar } from "./guestbook-avatar.component";
export function GuestbookList({
  entries,
}: Readonly<{ entries: readonly GuestbookEntry[] }>) {
  return (
    <ul {...stylex.props(panel.list)}>
      {entries.map((entry) => (
        <li key={entry.id} {...stylex.props(panel.entry)}>
          <div {...stylex.props(panel.byline)}>
            <GuestbookAvatar githubUsername={entry.githubUsername} />
            <div {...stylex.props(panel.author)}>
              <strong {...stylex.props(panel.authorName)}>
                {entry.name || "Anonymous"}
              </strong>
              <span {...stylex.props(panel.email)}>
                {entry.email || "No email provided"}
              </span>
            </div>
            <time dateTime={entry.date} {...stylex.props(panel.date)}>
              {entry.date.slice(5, 10)}
            </time>
          </div>
          <p {...stylex.props(panel.message)}>{entry.message}</p>
        </li>
      ))}
    </ul>
  );
}
