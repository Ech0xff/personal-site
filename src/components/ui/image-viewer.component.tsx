"use client";

import * as stylex from "@stylexjs/stylex";
import { Minus, Plus, X } from "lucide-react";
import { type ReactNode } from "react";

import {
  color,
  font,
  space,
  shape,
  shadow,
  motionToken,
} from "#design/tokens.stylex";

import { useImageViewer } from "./image-viewer.hook";
const styles = stylex.create({
  dialog: {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
    marginTop: "0px",
    marginRight: "0px",
    marginBottom: "0px",
    marginLeft: "0px",
    height: "100dvh",
    maxHeight: "none",
    width: "100dvw",
    maxWidth: "none",
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
    backgroundColor: {
      default: `color-mix(in srgb, ${color.viewerCanvas} 90%, transparent)`,
      "::backdrop": "transparent",
    },
    paddingTop: "0px",
    paddingRight: "0px",
    paddingBottom: "0px",
    paddingLeft: "0px",
    color: color.viewerText,
    backdropFilter: "blur(8px)",
    transitionDuration: motionToken.fast,
  },
  toolbar: {
    position: "fixed",
    bottom: space.md,
    left: "50%",
    zIndex: 10,
    display: "flex",
    translate: "-50% 0",
    alignItems: "center",
    overflow: "hidden",
    borderTopLeftRadius: shape.small,
    borderTopRightRadius: shape.small,
    borderBottomRightRadius: shape.small,
    borderBottomLeftRadius: shape.small,
    borderTopWidth: shape.fine,
    borderRightWidth: shape.fine,
    borderBottomWidth: shape.fine,
    borderLeftWidth: shape.fine,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderTopColor: color.viewerBorder,
    borderRightColor: color.viewerBorder,
    borderBottomColor: color.viewerBorder,
    borderLeftColor: color.viewerBorder,
    backgroundColor: `color-mix(in srgb, ${color.viewerSurface} 95%, transparent)`,
    color: color.viewerText,
    boxShadow: shadow.lifted,
    backdropFilter: "blur(12px)",
  },
  close: {
    display: "flex",
    height: "40px",
    width: "40px",
    cursor: "pointer",
    alignItems: "center",
    justifyContent: "center",
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    backgroundColor: {
      default: null,
      ":hover": `color-mix(in srgb, ${color.viewerText} 15%, transparent)`,
    },
  },
  icon: {
    width: "20px",
    height: "20px",
  },
  zoom: {
    display: "flex",
    height: "40px",
    width: "40px",
    cursor: {
      default: "pointer",
      ":disabled": "not-allowed",
    },
    alignItems: "center",
    justifyContent: "center",
    transitionProperty:
      "color, background-color, border-color, text-decoration-color",
    transitionDuration: motionToken.fast,
    transitionTimingFunction: "ease",
    backgroundColor: {
      default: null,
      ":hover": `color-mix(in srgb, ${color.viewerText} 15%, transparent)`,
    },
    opacity: {
      default: null,
      ":disabled": 0.45,
    },
  },
  label: {
    minWidth: "56px",
    paddingLeft: space.xxs,
    paddingRight: space.xxs,
    textAlign: "center",
    fontSize: font.control,
    lineHeight: 1.5,
    fontWeight: font.medium,
    fontVariantNumeric: "tabular-nums",
  },
  viewport: {
    height: "100dvh",
    width: "100dvw",
    overflow: "auto",
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: "96px",
    paddingLeft: space.md,
  },
  canvas: {
    display: "flex",
    minHeight: "100%",
    width: "max-content",
    minWidth: "100%",
    cursor: "zoom-out",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: "auto",
    maxWidth: "none",
    objectFit: "contain",
    boxShadow: shadow.viewer,
  },
});
export function ImageViewer({ children }: { children: ReactNode }) {
  const {
    image,
    scale,
    fitWidth,
    dialogRef,
    canZoomOut,
    canZoomIn,
    updateScale,
    fitImageToViewport,
    close,
    scaleStep,
  } = useImageViewer();
  return (
    <>
      {children}
      <dialog
        ref={dialogRef}
        aria-label={image?.alt || "Image viewer"}
        {...stylex.props(styles.dialog)}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onKeyDown={(event) => {
          if (event.key === "Escape") event.stopPropagation();
        }}
      >
        {image && (
          <>
            <div {...stylex.props(styles.toolbar)}>
              <button
                type="button"
                {...stylex.props(styles.close)}
                aria-label="Close image viewer"
                title="Close image viewer"
                onClick={close}
              >
                <X {...stylex.props(styles.icon)} />
              </button>
              <button
                type="button"
                {...stylex.props(styles.zoom)}
                aria-label="Zoom out"
                disabled={!canZoomOut}
                onClick={() => updateScale(scale - scaleStep)}
              >
                <Minus {...stylex.props(styles.icon)} />
              </button>
              <span {...stylex.props(styles.label)}>{scale}%</span>
              <button
                type="button"
                {...stylex.props(styles.zoom)}
                aria-label="Zoom in"
                disabled={!canZoomIn}
                onClick={() => updateScale(scale + scaleStep)}
              >
                <Plus {...stylex.props(styles.icon)} />
              </button>
            </div>
            <div {...stylex.props(styles.viewport)}>
              <button
                type="button"
                aria-label="Close image viewer"
                onClick={close}
                {...stylex.props(styles.canvas)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.src}
                  alt={image.alt}
                  style={{
                    width:
                      fitWidth === undefined
                        ? undefined
                        : `${(fitWidth * scale) / 100}px`,
                    visibility: fitWidth === undefined ? "hidden" : "visible",
                  }}
                  {...stylex.props(styles.image)}
                  onLoad={(event) => fitImageToViewport(event.currentTarget)}
                />
              </button>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
