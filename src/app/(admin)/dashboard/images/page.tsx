"use client";

import * as stylex from "@stylexjs/stylex";
import { ArrowDownAZ, ArrowUpAZ, Calendar, HardDrive } from "lucide-react";

import Button from "#components/ui/button.component";
import Image from "#components/ui/image.component";
import Stack from "#components/ui/stack.component";
import { card } from "#design/interaction.stylex";
import {
  color,
  font,
  space,
  shape,
  shadow,
  motionToken,
} from "#design/tokens.stylex";
import { formatTime } from "#lib/shared/utils/date.helper";
import { formatSize } from "#lib/shared/utils/file-size.helper";

import DashboardShell from "../_components/layout/dashboard-shell.component";
import ImageActionRender from "./_components/image-action-render.component";
import { useImages } from "./_hooks/images.hook";
const styles = stylex.create({
  column: {
    gap: space.md,
  },
  row: {
    flexWrap: "wrap",
    alignItems: "center",
    gap: space.sm,
  },
  row2: {
    alignItems: "center",
    gap: space.xs,
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
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
    backgroundColor: color.surfaceMuted,
    paddingTop: space.xxs,
    paddingRight: space.xxs,
    paddingBottom: space.xxs,
    paddingLeft: space.xxs,
  },
  button: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    paddingLeft: space.sm,
    paddingRight: space.sm,
    paddingTop: "6px",
    paddingBottom: "6px",
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  button2: {
    backgroundColor: color.surfaceSelected,
    color: color.text,
    boxShadow: shadow.subtle,
  },
  button3: {
    color: {
      default: color.muted,
      ":hover": color.secondary,
    },
  },
  calendar: {
    height: space.md,
    width: space.md,
  },
  icon: {
    height: "14px",
    width: "14px",
  },
  row3: {
    marginLeft: "auto",
    alignItems: "center",
    gap: space.xs,
    fontSize: font.small,
    lineHeight: 1.5,
    fontWeight: font.medium,
    color: color.secondary,
  },
  label: {
    borderTopLeftRadius: shape.pill,
    borderTopRightRadius: shape.pill,
    borderBottomRightRadius: shape.pill,
    borderBottomLeftRadius: shape.pill,
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
    backgroundColor: color.input,
    paddingLeft: "10px",
    paddingRight: "10px",
    paddingTop: space.xxs,
    paddingBottom: space.xxs,
    boxShadow: shadow.subtle,
  },
  column2: {
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: shape.control,
    borderTopRightRadius: shape.control,
    borderBottomRightRadius: shape.control,
    borderBottomLeftRadius: shape.control,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "dashed",
    borderRightStyle: "dashed",
    borderBottomStyle: "dashed",
    borderLeftStyle: "dashed",
    borderTopColor: color.borderStrong,
    borderRightColor: color.borderStrong,
    borderBottomColor: color.borderStrong,
    borderLeftColor: color.borderStrong,
    paddingTop: space.xxl,
    paddingBottom: space.xxl,
    color: color.muted,
  },
  hardDrive: {
    marginBottom: space.xs,
    height: space.xxl,
    width: space.xxl,
    opacity: 0.5,
  },
  container: {
    display: "grid",
    gridTemplateColumns: {
      default: "repeat(2, minmax(0, 1fr))",
      "@media (min-width: 640px)": "repeat(3, minmax(0, 1fr))",
      "@media (min-width: 768px)": "repeat(4, minmax(0, 1fr))",
      "@media (min-width: 1024px)": "repeat(5, minmax(0, 1fr))",
      "@media (min-width: 1280px)": "repeat(6, minmax(0, 1fr))",
    },
    gap: space.md,
  },
  container2: {
    position: "relative",
  },
  container3: {
    pointerEvents: "none",
    position: "absolute",
    right: "0px",
    bottom: "0px",
    left: "0px",
    borderBottomLeftRadius: shape.control,
    borderBottomRightRadius: shape.control,
    backgroundImage: color.imageGradient,
    paddingTop: space.xs,
    paddingRight: space.xs,
    paddingBottom: space.xs,
    paddingLeft: space.xs,
    opacity: {
      default: 0,
      [stylex.when.ancestor(":focus-within", card)]: 1,
      [stylex.when.ancestor(":hover", card)]: 1,
    },
    transitionProperty: "opacity",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  description: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontSize: font.small,
    lineHeight: 1.5,
    color: `color-mix(in srgb, ${color.objectLabel} 90%, transparent)`,
  },
  row4: {
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: font.small,
    lineHeight: 1.5,
    color: `color-mix(in srgb, ${color.objectLabel} 70%, transparent)`,
  },
});
export default function ImagesPage() {
  const {
    images,
    sortedImages,
    loading,
    error,
    removeImage,
    sortField,
    sortOrder,
    isPending,
    toggleSort,
    handleDelete,
  } = useImages();
  const SortIcon = sortOrder === "asc" ? ArrowUpAZ : ArrowDownAZ;
  const totalSize = images.reduce((sum, image) => sum + image.size, 0);
  return (
    <DashboardShell title="Image Gallery" loading={loading} error={error}>
      <Stack y xstyle={styles.column}>
        <Stack x xstyle={styles.row}>
          <Stack x xstyle={styles.row2}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSort("createdAt")}
              xstyle={[
                styles.button,
                sortField === "createdAt" ? styles.button2 : styles.button3,
                null,
              ]}
            >
              <Calendar {...stylex.props(styles.calendar)} />
              Time
              {sortField === "createdAt" && (
                <SortIcon {...stylex.props(styles.icon)} />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSort("size")}
              xstyle={[
                styles.button,
                sortField === "size" ? styles.button2 : styles.button3,
                null,
              ]}
            >
              <HardDrive {...stylex.props(styles.calendar)} />
              Size
              {sortField === "size" && (
                <SortIcon {...stylex.props(styles.icon)} />
              )}
            </Button>
          </Stack>
          <Stack x xstyle={styles.row3}>
            <span {...stylex.props(styles.label)}>
              {images.length} image{images.length !== 1 ? "s" : ""}
            </span>
            <span {...stylex.props(styles.label)}>
              {formatSize(totalSize)} total
            </span>
          </Stack>
        </Stack>
        {sortedImages.length === 0 ? (
          <Stack y xstyle={styles.column2}>
            <HardDrive {...stylex.props(styles.hardDrive)} />
            <p>No images found</p>
          </Stack>
        ) : (
          <div {...stylex.props(styles.container)}>
            {sortedImages.map((image) => (
              <div key={image.id} {...stylex.props([styles.container2, card])}>
                <Image
                  framed
                  src={image.url}
                  alt={image.name}
                  actionRender={() => (
                    <ImageActionRender
                      isPending={isPending}
                      image={image}
                      onDelete={(selected) =>
                        handleDelete(selected, removeImage)
                      }
                    />
                  )}
                />
                <div {...stylex.props(styles.container3)}>
                  <p {...stylex.props(styles.description)} title={image.name}>
                    {image.name}
                  </p>
                  <Stack x xstyle={styles.row4}>
                    <span>{formatSize(image.size)}</span>
                    <span>{formatTime(image.createdAt, "MMM D, YYYY")}</span>
                  </Stack>
                </div>
              </div>
            ))}
          </div>
        )}
      </Stack>
    </DashboardShell>
  );
}
