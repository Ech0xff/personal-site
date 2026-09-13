import * as stylex from "@stylexjs/stylex";
import { SquarePen, Trash2 } from "lucide-react";

import IconButton from "#components/ui/icon-button.component";

import { listStyles as styles } from "./content-list.style";
export function ContentActions({
  pending,
  onEdit,
  onDelete,
}: Readonly<{ pending: boolean; onEdit: () => void; onDelete: () => void }>) {
  return (
    <div {...stylex.props(styles.actions)}>
      <IconButton
        aria-label="Edit"
        title="Edit"
        size="sm"
        onClick={onEdit}
        xstyle={styles.iconButton}
      >
        <SquarePen size={18} />
      </IconButton>
      <IconButton
        aria-label="Delete"
        title="Delete"
        size="sm"
        disabled={pending}
        onClick={onDelete}
        xstyle={[styles.iconButton, styles.deleteButton]}
      >
        <Trash2 size={18} />
      </IconButton>
    </div>
  );
}
