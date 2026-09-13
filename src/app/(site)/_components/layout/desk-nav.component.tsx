"use client";
import * as stylex from "@stylexjs/stylex";
import { useEffect } from "react";

import { Magnetic } from "#components/ui/magnetic.component";
import {
  color,
  font,
  media,
  motionToken,
  shape,
  space,
} from "#design/tokens.stylex";

import { foundation } from "../../_design/foundation.style";
import { objectMarker } from "../../_design/object-feedback.stylex";
import { useDeskMenu } from "./desk-menu.hook";
import { DeskLink } from "./desk-navigation.component";
import { shell } from "./desk-shell.style";
import { navigation } from "./navigation.const";

const styles = stylex.create({
  root: { position: "relative" },
  trigger: {
    display: { default: "none", [media.phone]: "inline-flex" },
    alignItems: "center",
    gap: space.xs,
    minHeight: shape.touch,
    padding: 0,
    borderWidth: 0,
    borderStyle: "solid",
    backgroundColor: "transparent",
    fontFamily: font.mono,
    fontSize: font.bodySize,
    color: {
      default: color.text,
      ":hover": color.accent,
      ":focus-visible": color.accent,
    },
  },
  marker: {
    width: "5px",
    height: "5px",
    backgroundColor: "currentColor",
    borderRadius: shape.round,
  },
  links: {
    position: { default: "static", [media.phone]: "absolute" },
    top: "100%",
    right: 0,
    flexDirection: { default: "row", [media.phone]: "column" },
    alignItems: { default: "center", [media.phone]: "flex-end" },
    gap: { default: space.xl, [media.phone]: space.xs },
    paddingTop: { default: 0, [media.phone]: space.sm },
    visibility: { default: "visible", [media.phone]: "hidden" },
    opacity: { default: 1, [media.phone]: 0 },
    pointerEvents: { default: "auto", [media.phone]: "none" },
    transform: {
      default: "none",
      [media.phone]: "translateY(-6px)",
      [media.reduce]: "none",
    },
    transitionProperty: "opacity, transform, visibility",
    transitionDuration: {
      default: `${motionToken.normal}, ${motionToken.normal}, 0s`,
      [media.reduce]: "0s",
    },
    transitionDelay: {
      default: `0s, 0s, ${motionToken.normal}`,
      [media.reduce]: "0s",
    },
    transitionTimingFunction: motionToken.ease,
  },
  open: {
    visibility: "visible",
    opacity: 1,
    pointerEvents: "auto",
    transform: "none",
    transitionDelay: { default: "70ms, 70ms, 0s", [media.reduce]: "0s" },
  },
});
export function DeskNav({
  pathname,
  onOpenChange,
}: Readonly<{ pathname: string; onOpenChange: (open: boolean) => void }>) {
  const menu = useDeskMenu(pathname);
  useEffect(() => onOpenChange(menu.open), [menu.open, onOpenChange]);
  return (
    <div
      ref={menu.root}
      {...stylex.props(styles.root)}
      onPointerEnter={menu.enter}
      onPointerLeave={menu.leave}
      onBlur={menu.blur}
    >
      <button
        ref={menu.trigger}
        type="button"
        {...stylex.props(styles.trigger, foundation.focus)}
        aria-expanded={menu.open}
        aria-controls="desk-navigation"
        onClick={menu.toggle}
        onKeyDown={menu.keyDown}
      >
        <Magnetic>
          <span {...stylex.props(styles.marker)} aria-hidden="true" />
          Menu
        </Magnetic>
      </button>
      <nav
        id="desk-navigation"
        inert={menu.hidden}
        {...stylex.props(shell.nav, styles.links, menu.open && styles.open)}
        aria-label="Main navigation"
      >
        {navigation
          .filter((item) => item.href !== "/")
          .map((item) => (
            <DeskLink
              key={item.href}
              href={item.href}
              onClick={menu.close}
              {...stylex.props(
                shell.link,
                objectMarker,
                foundation.focus,
                (pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)) &&
                  shell.current,
              )}
              aria-current={
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "page"
                  : undefined
              }
            >
              <Magnetic>
                {item.label}
                <span
                  aria-hidden="true"
                  {...stylex.props(
                    shell.dot,
                    (pathname === item.href ||
                      pathname.startsWith(`${item.href}/`)) &&
                      shell.currentDot,
                  )}
                />
              </Magnetic>
            </DeskLink>
          ))}
      </nav>
    </div>
  );
}
