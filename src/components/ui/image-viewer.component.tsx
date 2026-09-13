"use client";

import * as stylex from "@stylexjs/stylex";
import { ZoomIn, ZoomOut } from "lucide-react";
import { type ReactNode } from "react";

import { color, font, space, shadow, motionToken } from "#design/tokens.stylex";

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
    gap: space.xs,
    color: color.viewerText,
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
    padding: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
    color: "inherit",
    outline: { default: "none", ":focus-visible": `2px solid ${color.focus}` },
    outlineOffset: "2px",
    transform: { default: "none", ":hover:not(:disabled)": "scale(1.12)" },
    transitionProperty: "transform, opacity",
    transitionDuration: {
      default: motionToken.fast,
      "@media (prefers-reduced-motion: reduce)": "0s",
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
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    color: "inherit",
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
        data-lenis-prevent
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
                data-viewer-control
                {...stylex.props(styles.zoom)}
                aria-label="Zoom out"
                disabled={!canZoomOut}
                onClick={() => updateScale(scale - scaleStep)}
              >
                <ZoomOut {...stylex.props(styles.icon)} />
              </button>
              <span {...stylex.props(styles.label)}>{scale}%</span>
              <button
                type="button"
                data-viewer-control
                {...stylex.props(styles.zoom)}
                aria-label="Zoom in"
                disabled={!canZoomIn}
                onClick={() => updateScale(scale + scaleStep)}
              >
                <ZoomIn {...stylex.props(styles.icon)} />
              </button>
            </div>
            <div {...stylex.props(styles.viewport)}>
              <button
                type="button"
                aria-label="Close image viewer"
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
