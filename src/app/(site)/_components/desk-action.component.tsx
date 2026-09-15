"use client";
import * as stylex from "@stylexjs/stylex";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

import { Magnetic } from "#components/ui/magnetic.component";
import {
  color,
  font,
  material,
  motionToken,
  shadow,
  shape,
} from "#design/tokens.stylex";

const styles = stylex.create({
  anchor: { display: "inline-flex", flexShrink: 0 },
  button: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    padding: 0,
    borderWidth: 0,
    borderRadius: shape.control,
    backgroundColor: "transparent",
    color: { default: color.muted, ":hover": color.accent },
    outlineColor: color.accent,
    outlineOffset: "2px",
    opacity: { default: 1, ":disabled": 0.35 },
    transitionProperty: "background-color, color",
    transitionDuration: motionToken.fast,
  },
  selected: { color: color.accent },
  display: {
    color: material.phosphor,
    backgroundColor: { default: "transparent", ":hover": material.highlight },
  },
  hint: {
    position: "fixed",
    transform: "translate(-50%, -100%)",
    zIndex: 100,
    pointerEvents: "none",
    maxWidth: "220px",
    width: "max-content",
    paddingBlock: "6px",
    paddingInline: "10px",
    borderRadius: shape.small,
    backgroundColor: color.surface,
    color: color.text,
    boxShadow: shadow.panel,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: color.line,
    fontFamily: font.mono,
    fontSize: font.tiny,
    lineHeight: 1.5,
    textAlign: "center",
  },
});

export function DeskAction({
  label,
  children,
  onClick,
  disabled = false,
  pressed,
  display = false,
}: Readonly<{
  label: string;
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  pressed?: boolean;
  display?: boolean;
}>) {
  const anchor = useRef<HTMLSpanElement>(null);
  const id = useId();
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const show = () => {
    const rect = anchor.current?.getBoundingClientRect();
    if (rect)
      setPoint({
        x: Math.max(
          118,
          Math.min(window.innerWidth - 118, rect.x + rect.width / 2),
        ),
        y: rect.top - 8,
      });
  };
  useEffect(() => {
    if (!point) return;
    const close = () => setPoint(null);
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    window.addEventListener("keydown", escape);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", escape);
    };
  }, [point]);
  return (
    <span
      ref={anchor}
      {...stylex.props(styles.anchor)}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") show();
      }}
      onPointerLeave={() => setPoint(null)}
      onFocus={show}
      onBlur={() => setPoint(null)}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={point ? id : undefined}
        aria-pressed={pressed}
        disabled={disabled}
        onClick={() => {
          setPoint(null);
          onClick();
        }}
        {...stylex.props(
          styles.button,
          pressed && styles.selected,
          display && styles.display,
        )}
      >
        <Magnetic compact>{children}</Magnetic>
      </button>
      {point &&
        createPortal(
          <span
            id={id}
            role="tooltip"
            {...stylex.props(styles.hint)}
            style={{ left: point.x, top: point.y }}
          >
            {label}
          </span>,
          document.body,
        )}
    </span>
  );
}
