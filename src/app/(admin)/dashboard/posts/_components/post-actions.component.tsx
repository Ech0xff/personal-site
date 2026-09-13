"use client";

import * as stylex from "@stylexjs/stylex";
import { Edit, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import Link from "#components/shared/link.component";
import IconButton from "#components/ui/icon-button.component";
import { color, space, shape, motionToken } from "#design/tokens.stylex";
import { deletePostByBrowser } from "#lib/client/services";
const styles = stylex.create({
  link: {
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    paddingTop: "6px",
    paddingRight: "6px",
    paddingBottom: "6px",
    paddingLeft: "6px",
    color: {
      default: color.muted,
      ":hover": color.secondary,
    },
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    backgroundColor: {
      default: null,
      ":hover": color.surfaceMuted,
    },
  },
  icon: {
    height: space.md,
    width: space.md,
  },
  icon2: {
    color: {
      default: color.muted,
      ":hover": color.dangerText,
    },
    backgroundColor: {
      default: null,
      ":hover": color.dangerSurface,
    },
  },
});
interface PostActionsProps {
  postId: string;
  openEditor: (id: string | null) => void;
  successCallback?: (postId: string) => void;
}
export default function PostActions({
  postId,
  openEditor,
  successCallback,
}: PostActionsProps) {
  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    const toastId = toast.loading("Deleting post...");
    try {
      await deletePostByBrowser(postId);
      if (successCallback) successCallback(postId);
      toast.success("Post deleted successfully.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete post",
        {
          id: toastId,
        },
      );
    }
  };
  return (
    <>
      <Link
        href={`/posts/${postId}`}
        {...stylex.props(styles.link)}
        title="View"
      >
        <Eye {...stylex.props(styles.icon)} />
      </Link>
      <IconButton
        size="sm"
        onClick={() => openEditor(postId)}
        title="Edit"
        aria-label="Edit"
      >
        <Edit {...stylex.props(styles.icon)} />
      </IconButton>
      <IconButton
        size="sm"
        xstyle={styles.icon2}
        onClick={handleDelete}
        title="Delete"
        aria-label="Delete"
      >
        <Trash2 {...stylex.props(styles.icon)} />
      </IconButton>
    </>
  );
}
