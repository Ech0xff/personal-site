import * as stylex from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";

import { lightbox } from "#design/interaction.stylex";
import type { StyleInput } from "#design/style.type";
import { color, shape, motionToken } from "#design/tokens.stylex";
const styles = stylex.create({
  root: {
    position: "relative",
    width: "100%",
    transitionProperty:
      "color, background-color, border-color, opacity, box-shadow, transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  framed: {
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
    borderTopColor: {
      default: color.line,
      ":hover": color.borderStrong,
    },
    borderRightColor: {
      default: color.line,
      ":hover": color.borderStrong,
    },
    borderBottomColor: {
      default: color.line,
      ":hover": color.borderStrong,
    },
    borderLeftColor: {
      default: color.line,
      ":hover": color.borderStrong,
    },
    backgroundColor: color.surfaceMuted,
  },
  unframed: {
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0",
    borderBottomRightRadius: "0",
    borderBottomLeftRadius: "0",
    borderTopStyle: "none",
    borderRightStyle: "none",
    borderBottomStyle: "none",
    borderLeftStyle: "none",
    backgroundColor: "transparent",
  },
  fixedSize: {
    aspectRatio: "1",
  },
  preview: {
    overflow: "hidden",
  },
  button: {
    cursor: "pointer",
  },
  fluidButton: {
    display: "block",
    minWidth: "100%",
  },
  fixedButton: {
    height: "100%",
    width: "100%",
  },
  image: {
    display: "block",
    height: "auto",
    maxWidth: "none",
  },
  thumbnailImage: {
    display: "block",
    height: "100%",
    width: "100%",
  },
  fluidImage: {
    width: "100%",
    maxWidth: "100%",
  },
  contain: {
    objectFit: "contain",
  },
  cover: {
    objectFit: "cover",
  },
  hoverZoom: {
    transitionProperty: "transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    scale: {
      default: null,
      [stylex.when.ancestor(":hover", lightbox)]: 1.05,
    },
  },
  overlay: {
    pointerEvents: "none",
    position: "absolute",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
    backgroundColor: {
      default: "transparent",
      [stylex.when.ancestor(":hover", lightbox)]:
        `color-mix(in srgb, ${color.viewerCanvas} 10%, transparent)`,
    },
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
});
interface Props extends ComponentPropsWithoutRef<"div"> {
  /** Image source URL. */
  src?: string;
  /** Accessible image description. */
  alt?: string;
  /** Optional controls rendered over the image container. */
  actionRender?: () => React.ReactNode;
  /** Composable styles for the outer image container. */
  xstyle?: StyleInput;
  /** Image object-fit mode. */
  fit?: "cover" | "contain";
  /** Shows a hover dim overlay when enabled. Disabled by default. */
  overlay?: boolean;
  /** Thumbnail keeps a square frame; fluid uses the image's natural ratio. */
  variant?: "thumbnail" | "fluid";
  /** Enables the default framed thumbnail surface. Disabled by default. */
  framed?: boolean;
}
export default function Image({
  src,
  alt,
  actionRender,
  xstyle,
  fit = "cover",
  overlay = false,
  variant = "thumbnail",
  framed = false,
  ...props
}: Props) {
  const isFluid = variant === "fluid";
  return (
    <div
      {...props}
      {...stylex.props([
        [styles.root, lightbox],
        framed ? styles.framed : styles.unframed,
        isFluid ? null : styles.fixedSize,
        styles.preview,
        xstyle,
      ])}
    >
      <button
        type="button"
        aria-label={alt ? `Preview ${alt}` : "Preview image"}
        data-viewer-trigger
        data-src={src}
        data-alt={alt}
        {...stylex.props([
          styles.button,
          isFluid ? styles.fluidButton : styles.fixedButton,
        ])}
      >
        {/* oxlint-disable-next-line next/no-img-element -- This viewer accepts arbitrary remote URLs and preserves natural image dimensions. */}
        <img
          src={src}
          alt={alt}
          {...stylex.props([
            isFluid ? styles.image : styles.thumbnailImage,
            isFluid ? styles.fluidImage : null,
            fit === "contain" ? styles.contain : styles.cover,
            isFluid ? null : styles.hoverZoom,
          ])}
          loading="lazy"
        />
        {overlay ? <div {...stylex.props(styles.overlay)} /> : null}
      </button>
      {actionRender?.()}
    </div>
  );
}
