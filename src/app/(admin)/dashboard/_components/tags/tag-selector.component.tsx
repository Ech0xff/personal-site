"use client";

import * as stylex from "@stylexjs/stylex";
import { Tag } from "lucide-react";

import Button from "#components/ui/button.component";
import { useModal } from "#components/ui/modal-provider.component";

import TagSelectorModal, {
  type TagSelectorProps,
} from "./tag-selector-modal.component";
const styles = stylex.create({
  tag: {
    height: "14px",
    width: "14px",
    rotate: "90deg",
  },
});
export default function TagSelector(props: TagSelectorProps) {
  const { open } = useModal();
  const selectedCount = props.selectedTags.length;
  return (
    <Button size="sm" onClick={() => open(<TagSelectorModal {...props} />)}>
      <Tag {...stylex.props(styles.tag)} />
      {selectedCount > 0 ? `Tags (${selectedCount})` : "Add tag"}
    </Button>
  );
}
