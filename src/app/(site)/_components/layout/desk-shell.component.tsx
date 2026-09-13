"use client";
import * as stylex from "@stylexjs/stylex";
import { motion } from "framer-motion";
import { Provider } from "jotai";
import { useState, type ReactNode } from "react";

import ThemeSync from "#components/shared/theme-sync.component";
import ThemeToggle from "#components/shared/theme-toggle.component";

import { foundation } from "../../_design/foundation.style";
import { DeskCurtain } from "./desk-curtain.component";
import { DeskNav } from "./desk-nav.component";
import { NavigationContext } from "./desk-navigation.component";
import { useDeskNavigation } from "./desk-navigation.hook";
import { shell } from "./desk-shell.style";
import { HomeSignature } from "./home-signature.component";
import { useDeskScroll } from "./use-desk-scroll.hook";
export function DeskShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Provider>
      <ThemeSync />
      <DeskShellContent>{children}</DeskShellContent>
    </Provider>
  );
}
function DeskShellContent({ children }: Readonly<{ children: ReactNode }>) {
  const navigation = useDeskNavigation();
  const { pathname, entryControls, content, active, navigate } = navigation;
  const [menuOpen, setMenuOpen] = useState(false);
  const scroll = useDeskScroll(active);
  return (
    <NavigationContext value={navigate}>
      <div {...stylex.props(shell.root)}>
        <motion.div
          data-scroll-progress=""
          aria-hidden="true"
          {...stylex.props(
            shell.progress,
            (!scroll.scrollable || active) && shell.hidden,
          )}
          style={{ scaleX: scroll.progress }}
        />
        <a {...stylex.props(shell.skip, foundation.focus)} href="#desk-main">
          Skip to content
        </a>
        <div ref={content} {...stylex.props(shell.content)}>
          <header
            {...stylex.props(
              shell.header,
              scroll.scrolled && shell.headerScrolled,
              menuOpen && shell.headerMenu,
            )}
          >
            <HomeSignature current={pathname === "/"} />
            <div {...stylex.props(shell.headerActions)}>
              <DeskNav pathname={pathname} onOpenChange={setMenuOpen} />
              <ThemeToggle />
            </div>
          </header>
          <motion.main
            id="desk-main"
            tabIndex={-1}
            {...stylex.props(shell.main)}
            animate={entryControls}
            initial={false}
          >
            {children}
          </motion.main>
        </div>
        <DeskCurtain {...navigation} />
      </div>
    </NavigationContext>
  );
}
