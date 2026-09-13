"use client";

import * as stylex from "@stylexjs/stylex";
import { Plus, Tags } from "lucide-react";

import Button from "#components/ui/button.component";
import { useModal } from "#components/ui/modal-provider.component";
import { MODAL_ANCHOR, MODAL_BOUNDARY } from "#components/ui/modal.const";
import Stack from "#components/ui/stack.component";
import { color, font, space, shape } from "#design/tokens.stylex";
import type { TagWithCount } from "#types";

import TagSphere from "../_components/features/tags/tag-sphere.component";
import DashboardShell from "../_components/layout/dashboard-shell.component";
import TagEditor from "./_components/tag-editor.component";
import { useTags } from "./_hooks/tags.hook";
const styles = stylex.create({
  containerStyles: {
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: space.md,
    paddingLeft: space.md,
  },
  column: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    gap: space.md,
  },
  row: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.sm,
    borderTopLeftRadius: shape.card,
    borderTopRightRadius: shape.card,
    borderBottomRightRadius: shape.card,
    borderBottomLeftRadius: shape.card,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: color.line,
    borderRightColor: color.line,
    borderBottomColor: color.line,
    borderLeftColor: color.line,
    backgroundColor: color.surface,
    paddingLeft: space.md,
    paddingRight: space.md,
    paddingTop: space.sm,
    paddingBottom: space.sm,
    fontSize: font.control,
    lineHeight: 1.5,
    color: color.secondary,
  },
  row2: {
    alignItems: "center",
    gap: space.xs,
  },
  tags: {
    height: space.md,
    width: space.md,
  },
  button: {
    gap: space.xxs,
  },
  container: {
    display: "grid",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: "0%",
    alignItems: "center",
    justifyItems: "center",
    overflow: "hidden",
  },
  tagSphere: {
    aspectRatio: "1",
    height: "100%",
  },
});
export default function TagsPage() {
  const { tags: displayTags, loading, error, createTag, updateTag } = useTags();
  const { open, close } = useModal();
  const openEditor = (tag?: TagWithCount) => {
    const id = open(
      <TagEditor
        tag={tag}
        onClose={() => close(id)}
        onSave={async (input) => {
          if (tag)
            await updateTag({
              ...input,
              id: tag.id,
            });
          else await createTag(input);
        }}
      />,
      {
        boundary: MODAL_BOUNDARY.ANCHOR,
        positionAnchor: MODAL_ANCHOR.DASHBOARD,
        containerStyles: styles.containerStyles,
      },
    );
  };
  return (
    <DashboardShell title="Tags" loading={loading} error={error}>
      <Stack y xstyle={styles.column}>
        <Stack x xstyle={styles.row}>
          <Stack x xstyle={styles.row2}>
            <Tags {...stylex.props(styles.tags)} />
            <span>
              {displayTags.length} tag{displayTags.length !== 1 ? "s" : ""}
            </span>
          </Stack>
          <Button
            variant="secondary"
            onClick={() => openEditor()}
            xstyle={styles.button}
          >
            <Plus {...stylex.props(styles.tags)} />
            Add tag
          </Button>
        </Stack>
        <div {...stylex.props(styles.container)}>
          <TagSphere
            xstyle={styles.tagSphere}
            onTagClick={openEditor}
            tags={displayTags}
          />
        </div>
      </Stack>
    </DashboardShell>
  );
}
