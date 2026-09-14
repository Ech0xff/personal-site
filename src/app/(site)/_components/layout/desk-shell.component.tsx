"use client";
import * as stylex from "@stylexjs/stylex";
import { motion } from "framer-motion";
import { Provider } from "jotai";
import { useState, type ReactNode } from "react";

import ThemeSync from "#components/shared/theme-sync.component";
import ThemeToggle from "#components/shared/theme-toggle.component";
import { ImageViewer } from "#components/ui/image-viewer.component";

import { foundation } from "../../_design/foundation.style";
import { DeskCurtain } from "./desk-curtain.component";
import { DeskNav } from "./desk-nav.component";
import { NavigationContext } from "./desk-navigation.component";
import { useDeskNavigation } from "./desk-navigation.hook";
import { shell } from "./desk-shell.style";
import { useDeskVisits } from "./desk-visits.hook";
import { HomeSignature } from "./home-signature.component";
import { useRoutePrefetch } from "./route-prefetch.hook";
import { RouteReadinessContext } from "./route-readiness.hook";
import { useDeskScroll } from "./use-desk-scroll.hook";
import { ViewportOverlayContext } from "./viewport-overlay.component";
export function DeskShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Provider>
      <ThemeSync />
      <ImageViewer>
        <DeskShellContent>{children}</DeskShellContent>
      </ImageViewer>
    </Provider>
  );
}
function DeskShellContent({ children }: Readonly<{ children: ReactNode }>) {
  const navigation = useDeskNavigation();
  useRoutePrefetch();
  const { pathname, entryControls, content, active, navigate } = navigation;
  useDeskVisits(pathname);
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlayRoot, setOverlayRoot] = useState<HTMLDivElement | null>(null);
  const scroll = useDeskScroll(active);
  return (
    <RouteReadinessContext value={navigation.readiness}>
      <NavigationContext value={navigate}>
        <ViewportOverlayContext value={overlayRoot}>
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
            <a
              {...stylex.props(shell.skip, foundation.focus)}
              href="#desk-main"
              tabIndex={active ? -1 : undefined}
              aria-hidden={active}
            >
              Skip to content
            </a>
            <div
              ref={content}
              {...stylex.props(
                shell.content,
                pathname === "/" && shell.homeContent,
              )}
            >
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
              <div ref={setOverlayRoot} data-viewport-overlays />
            </div>
            <DeskCurtain {...navigation} />
          </div>
        </ViewportOverlayContext>
      </NavigationContext>
    </RouteReadinessContext>
  );
}
