"use client";

import { Tag } from "lucide-react";

import Button from "@/components/ui/Button";
import { useModal } from "@/components/ui/ModalProvider";

import TagSelectorModal, { type TagSelectorProps } from "./TagSelectorModal";

export default function TagSelector(props: TagSelectorProps) {
  const { open } = useModal();
  const selectedCount = props.selectedTags.length;

  return (
    <Button
      type="button"
      onClick={() => open(<TagSelectorModal {...props} />)}
      className="rounded-md px-2 py-1 text-xs"
    >
      <Tag className="h-3.5 w-3.5 rotate-90" />
      {selectedCount > 0 ? `Tags (${selectedCount})` : "Add tag"}
    </Button>
  );
}
