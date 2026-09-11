"use client";

import { Plus, Tags } from "lucide-react";

import TagSphere from "#components/features/tags/tag-sphere.component";
import Button from "#components/ui/button.component";
import { useModal } from "#components/ui/modal-provider.component";
import { MODAL_ANCHOR, MODAL_BOUNDARY } from "#components/ui/modal.const";
import Stack from "#components/ui/stack.component";
import type { TagWithCount } from "#types";

import DashboardShell from "../_components/layout/dashboard-shell.component";
import TagEditor from "./_components/tag-editor.component";
import { useTags } from "./_hooks/tags.hook";

export default function TagsPage() {
  const { tags: displayTags, loading, error, createTag, updateTag } = useTags();
  const { open, close } = useModal();

  const openEditor = (tag?: TagWithCount) => {
    const id = open(
      <TagEditor
        tag={tag}
        onClose={() => close(id)}
        onSave={async (input) => {
          if (tag) await updateTag({ ...input, id: tag.id });
          else await createTag(input);
        }}
      />,
      {
        boundary: MODAL_BOUNDARY.ANCHOR,
        positionAnchor: MODAL_ANCHOR.DASHBOARD,
        containerClassName: "p-4",
      },
    );
  };

  return (
    <DashboardShell title="Tags" loading={loading} error={error}>
      <Stack y className="flex-1 gap-4">
        <Stack
          x
          className="items-center justify-between gap-3 rounded-xl border border-border-default bg-surface-card px-4 py-3 text-sm text-text-secondary"
        >
          <Stack x className="items-center gap-2">
            <Tags className="h-4 w-4" />
            <span>
              {displayTags.length} tag{displayTags.length !== 1 ? "s" : ""}
            </span>
          </Stack>
          <Button
            variant="secondary"
            onClick={() => openEditor()}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add tag
          </Button>
        </Stack>
        <div className="grid flex-1 place-items-center overflow-hidden">
          <TagSphere
            className="aspect-square h-full"
            onTagClick={openEditor}
            tags={displayTags}
          />
        </div>
      </Stack>
    </DashboardShell>
  );
}
