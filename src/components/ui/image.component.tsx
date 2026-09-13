import * as stylex from "@stylexjs/stylex";
import type { ComponentPropsWithoutRef } from "react";

import { lightbox } from "#design/interaction.stylex";
import type { StyleInput } from "#design/style.type";
import { color, shape, motionToken } from "#design/tokens.stylex";
const styles = stylex.create({
  container: {
    position: "relative",
    width: "100%",
    transitionProperty:
      "color, background-color, border-color, opacity, box-shadow, transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
  },
  container2: {
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
  container3: {
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
  container4: {
    aspectRatio: "1",
  },
  container5: {
    overflow: "hidden",
  },
  button: {
    cursor: "pointer",
  },
  button2: {
    display: "block",
    minWidth: "100%",
  },
  button3: {
    height: "100%",
    width: "100%",
  },
  image: {
    display: "block",
    height: "auto",
    maxWidth: "none",
  },
  image2: {
    display: "block",
    height: "100%",
    width: "100%",
  },
  image3: {
    width: "100%",
    maxWidth: "100%",
  },
  image4: {
    objectFit: "contain",
  },
  image5: {
    objectFit: "cover",
  },
  image6: {
    transitionProperty: "transform, translate, scale",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    scale: {
      default: null,
      [stylex.when.ancestor(":hover", lightbox)]: 1.05,
    },
  },
  container6: {
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
        [styles.container, lightbox],
        framed ? styles.container2 : styles.container3,
        isFluid ? null : styles.container4,
        styles.container5,
        xstyle,
      ])}
    >
      <button
        type="button"
        data-viewer-trigger
        data-src={src}
        data-alt={alt}
        {...stylex.props([
          styles.button,
          isFluid ? styles.button2 : styles.button3,
        ])}
      >
        {/* oxlint-disable-next-line next/no-img-element -- This viewer accepts arbitrary remote URLs and preserves natural image dimensions. */}
        <img
          src={src}
          alt={alt}
          {...stylex.props([
            isFluid ? styles.image : styles.image2,
            isFluid ? styles.image3 : null,
            fit === "contain" ? styles.image4 : styles.image5,
            isFluid ? null : styles.image6,
          ])}
          loading="lazy"
        />
        {overlay ? <div {...stylex.props(styles.container6)} /> : null}
      </button>
      {actionRender?.()}
    </div>
  );
}
