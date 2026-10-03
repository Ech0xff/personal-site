import * as stylex from "@stylexjs/stylex";
import { Eye, EyeOff } from "lucide-react";
import type { ReactNode } from "react";

import type { ContentSummary } from "#lib/shared/content/content.schema";
import { formatTime } from "#lib/shared/utils/date.helper";

import { listStyles as styles } from "./content-list.style";

export function PostsList({
  items,
  pending,
  onVisibilityChange,
  actions,
  onEdit,
}: Readonly<{
  items: readonly ContentSummary[];
  pending: boolean;
  onVisibilityChange: (item: ContentSummary) => void;
  actions: (item: ContentSummary) => ReactNode;
  onEdit: (id: string) => void;
}>) {
  return (
    <ul aria-label="Posts" {...stylex.props(styles.posts)}>
      {items.map((item) => (
        <li key={item.id} {...stylex.props(styles.post)}>
          <button
            type="button"
            title={item.title}
            onClick={() => onEdit(item.id)}
            {...stylex.props(styles.postTitle)}
          >
            {item.title}
          </button>
          <time dateTime={item.published_at} {...stylex.props(styles.postDate)}>
            {formatTime(item.published_at)}
          </time>
          <div {...stylex.props(styles.postControls)}>
            <button
              type="button"
              aria-label={`Visibility of ${item.title}`}
              aria-pressed={item.status === "show"}
              disabled={pending}
              onClick={() => onVisibilityChange(item)}
              {...stylex.props(styles.postVisibility)}
            >
              {item.status === "show" ? (
                <Eye size={16} aria-hidden />
              ) : (
                <EyeOff size={16} aria-hidden />
              )}
              {item.status === "show" ? "Visible" : "Hidden"}
            </button>
            {actions(item)}
          </div>
        </li>
      ))}
    </ul>
  );
}
