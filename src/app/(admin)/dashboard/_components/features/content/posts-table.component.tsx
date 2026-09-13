import * as stylex from "@stylexjs/stylex";

import { formatTime } from "#lib/shared/utils/date.helper";

import { listStyles as styles } from "./content-list.style";
import type { ContentListViewProps } from "./content-list.type";
export function PostsTable({
  items,
  visibility,
  actions,
  onEdit,
}: ContentListViewProps & Readonly<{ onEdit: (id: string) => void }>) {
  return (
    <div {...stylex.props(styles.tableWrap)}>
      <table {...stylex.props(styles.table)}>
        <thead>
          <tr>
            {["Title", "Status", "Published at", "Actions"].map((label) => (
              <th key={label} scope="col" {...stylex.props(styles.th)}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={item.id}>
              <td
                {...stylex.props(
                  styles.td,
                  index === items.length - 1 && styles.lastCell,
                )}
              >
                <button
                  type="button"
                  onClick={() => onEdit(item.id)}
                  {...stylex.props(styles.postTitle)}
                >
                  {item.title}
                </button>
              </td>
              <td
                {...stylex.props(
                  styles.td,
                  index === items.length - 1 && styles.lastCell,
                )}
              >
                {visibility(item)}
              </td>
              <td
                {...stylex.props(
                  styles.td,
                  styles.meta,
                  index === items.length - 1 && styles.lastCell,
                )}
              >
                {formatTime(item.published_at)}
              </td>
              <td
                {...stylex.props(
                  styles.td,
                  index === items.length - 1 && styles.lastCell,
                )}
              >
                {actions(item)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
