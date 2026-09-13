"use client";

import * as stylex from "@stylexjs/stylex";
import { Minus, Plus, X } from "lucide-react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  color,
  font,
  space,
  shape,
  shadow,
  motionToken,
} from "#design/tokens.stylex";
const styles = stylex.create({
  container: {
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
  container2: {
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
  button: {
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
  button2: {
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
  container3: {
    height: "100dvh",
    width: "100dvw",
    overflow: "auto",
    paddingTop: space.md,
    paddingRight: space.md,
    paddingBottom: "96px",
    paddingLeft: space.md,
  },
  button3: {
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
type Image = {
  src: string;
  alt?: string;
};
const MIN_SCALE = 25;
const MAX_SCALE = 300;
const SCALE_STEP = 25;
const VIEWPORT_PADDING = 32;
const CONTROLS_SPACE = 112;
export function ImageViewer({ children }: { children: ReactNode }) {
  const [image, setImage] = useState<Image | null>(null);
  const [scale, setScale] = useState(100);
  const [fitWidth, setFitWidth] = useState<number>();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const canZoomOut = scale > MIN_SCALE;
  const canZoomIn = scale < MAX_SCALE;
  const updateScale = (nextScale: number) => {
    setScale(Math.min(MAX_SCALE, Math.max(MIN_SCALE, nextScale)));
  };
  const fitImageToViewport = (imageElement: HTMLImageElement) => {
    const availableWidth = window.innerWidth - VIEWPORT_PADDING;
    const availableHeight =
      window.innerHeight - VIEWPORT_PADDING - CONTROLS_SPACE;
    const widthScale = availableWidth / imageElement.naturalWidth;
    const heightScale = availableHeight / imageElement.naturalHeight;
    const fittedScale = Math.min(widthScale, heightScale, 1) * 100;
    setFitWidth(
      Math.max(1, Math.floor(imageElement.naturalWidth * (fittedScale / 100))),
    );
    setScale(100);
  };
  const open = useCallback((image: Image) => {
    setScale(100);
    setFitWidth(undefined);
    setImage(image);
  }, []);
  const close = useCallback(() => {
    setImage(null);
  }, []);
  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!image || !dialog) return;
    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [image]);
  useEffect(() => {
    const handleDelegatedClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const trigger = target.closest<HTMLElement>("[data-viewer-trigger]");
      if (!trigger) return;
      const { src, alt } = trigger.dataset;
      if (src)
        open({
          src,
          alt,
        });
    };
    document.addEventListener("click", handleDelegatedClick);
    return () => {
      document.removeEventListener("click", handleDelegatedClick);
    };
  }, [open]);
  return (
    <>
      {children}
      <dialog
        ref={dialogRef}
        aria-label={image?.alt || "Image viewer"}
        {...stylex.props(styles.container)}
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
            <div {...stylex.props(styles.container2)}>
              <button
                type="button"
                {...stylex.props(styles.button)}
                aria-label="Close image viewer"
                title="Close image viewer"
                onClick={close}
              >
                <X {...stylex.props(styles.icon)} />
              </button>
              <button
                type="button"
                {...stylex.props(styles.button2)}
                aria-label="Zoom out"
                disabled={!canZoomOut}
                onClick={() => updateScale(scale - SCALE_STEP)}
              >
                <Minus {...stylex.props(styles.icon)} />
              </button>
              <span {...stylex.props(styles.label)}>{scale}%</span>
              <button
                type="button"
                {...stylex.props(styles.button2)}
                aria-label="Zoom in"
                disabled={!canZoomIn}
                onClick={() => updateScale(scale + SCALE_STEP)}
              >
                <Plus {...stylex.props(styles.icon)} />
              </button>
            </div>
            <div {...stylex.props(styles.container3)}>
              <button
                type="button"
                aria-label="Close image viewer"
                onClick={close}
                {...stylex.props(styles.button3)}
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
