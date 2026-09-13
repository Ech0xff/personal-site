"use client";
import * as stylex from "@stylexjs/stylex";
import { motion, useAnimationControls } from "framer-motion";
import { Provider } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { foundation } from "../_design/foundation.style";
import { navigation, introGreetings } from "./desk-content.const";
import { DeskNav } from "./desk-nav.component";
import { NavigationContext } from "./desk-navigation.component";
import { shell } from "./desk-shell.style";
import { HomeSignature } from "./home-signature.component";
import { shouldPlayIntro, shuffleGreetings } from "./intro.helper";
import { useDeskScroll } from "./use-desk-scroll.hook";

type CurtainState =
  | { phase: "idle" | "intro" }
  | {
      phase: "covering" | "waiting" | "revealing";
      href: string;
      label: string;
    };
const easing = [0.76, 0, 0.24, 1] as const;

export function DeskShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <Provider>
      <DeskShellContent>{children}</DeskShellContent>
    </Provider>
  );
}
function DeskShellContent({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const controls = useAnimationControls();
  const entryControls = useAnimationControls();
  const [state, setState] = useState<CurtainState>(() => ({
    phase: pathname === "/" ? "intro" : "idle",
  }));
  const [word, setWord] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const introOrder = useRef<readonly string[] | null>(null);
  const content = useRef<HTMLDivElement>(null);
  const initialPath = useRef(pathname);
  const previousPath = useRef(pathname);
  const busy = useRef(state.phase !== "idle");
  const sequence = useRef(0);
  const active = state.phase !== "idle";
  const scroll = useDeskScroll(active);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const id = ++sequence.current;
    const historyReturn = performance
      .getEntriesByType("navigation")
      .some((entry) => "type" in entry && entry.type === "back_forward");
    if (
      !shouldPlayIntro(
        initialPath.current,
        historyReturn ? "back_forward" : undefined,
        matchMedia("(prefers-reduced-motion: reduce)").matches,
      )
    ) {
      setState({ phase: "idle" });
      busy.current = false;
    } else {
      introOrder.current ??= shuffleGreetings(
        introGreetings,
        introGreetings.slice(1).map(() => Math.random()),
      );
      setWord(introOrder.current[0] ?? null);
      introOrder.current.forEach((greeting, index) =>
        timers.push(
          setTimeout(
            () => setWord(greeting),
            index === 0 ? 0 : 350 + (index - 1) * 150,
          ),
        ),
      );
      timers.push(
        setTimeout(() => {
          if (sequence.current !== id) return;
          entryControls.set({ y: 24, opacity: 0 });
          void entryControls.start({
            y: 0,
            opacity: 1,
            transition: { duration: 0.75, delay: 0.15 },
          });
          void controls
            .start({ y: "-125%", transition: { duration: 0.75, ease: easing } })
            .then(() => {
              if (sequence.current === id) {
                setState({ phase: "idle" });
                busy.current = false;
              }
            });
        }, 1400),
      );
    }
    const invalidate = () => {
      sequence.current++;
    };
    return () => {
      invalidate();
      timers.forEach(clearTimeout);
    };
  }, [controls, entryControls]);

  useEffect(() => {
    const node = content.current;
    if (node) node.inert = active;
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      if (node) node.inert = false;
    };
  }, [active]);

  useEffect(() => {
    if (state.phase !== "waiting" || pathname !== state.href) return;
    const id = sequence.current;
    setState({ ...state, phase: "revealing" });
    entryControls.set({ y: 20, opacity: 0 });
    void entryControls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.65, delay: 0.1 },
    });
    void controls
      .start({ y: "-125%", transition: { duration: 0.65, ease: easing } })
      .then(() => {
        if (id !== sequence.current) return;
        setState({ phase: "idle" });
        busy.current = false;
        // Release inert before moving focus to the new page.
        if (content.current) content.current.inert = false;
        document
          .querySelector<HTMLElement>("#desk-main h1")
          ?.focus({ preventScroll: true });
      });
  }, [controls, entryControls, pathname, state]);

  useEffect(() => {
    if (state.phase === "idle") return;
    const timeout = setTimeout(() => {
      sequence.current++;
      controls.stop();
      entryControls.stop();
      entryControls.set({ y: 0, opacity: 1 });
      busy.current = false;
      setState({ phase: "idle" });
    }, 6000);
    return () => clearTimeout(timeout);
  }, [state, controls, entryControls]);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const cancel = () => {
      if (!preference.matches) return;
      sequence.current++;
      controls.stop();
      entryControls.stop();
      entryControls.set({ y: 0, opacity: 1 });
      busy.current = false;
      if (state.phase === "covering") router.push(state.href);
      setState({ phase: "idle" });
    };
    preference.addEventListener("change", cancel);
    return () => preference.removeEventListener("change", cancel);
  }, [controls, entryControls, router, state]);

  useEffect(() => {
    const cancelForHistory = () => {
      sequence.current++;
      controls.stop();
      entryControls.stop();
      entryControls.set({ y: 0, opacity: 1 });
      busy.current = false;
      setState({ phase: "idle" });
    };
    window.addEventListener("popstate", cancelForHistory);
    return () => window.removeEventListener("popstate", cancelForHistory);
  }, [controls, entryControls]);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (state.phase !== "idle") return;
    const frame = requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>("#desk-main h1")
        ?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [pathname, state.phase]);

  const navigate = (href: string) => {
    if (href === pathname || busy.current) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }
    const id = ++sequence.current;
    busy.current = true;
    const label =
      navigation.find((item) => item.href === href)?.label ?? "Design system";
    controls.set({ y: "125%" });
    setState({ phase: "covering", href, label });
    void controls
      .start({ y: "0%", transition: { duration: 0.5, ease: easing } })
      .then(() => {
        if (sequence.current !== id) return;
        setState({ phase: "waiting", href, label });
        router.push(href);
      });
  };

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
            <DeskNav pathname={pathname} onOpenChange={setMenuOpen} />
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
        <motion.div
          id="redesign-curtain"
          data-phase={state.phase}
          aria-hidden="true"
          {...stylex.props(shell.curtain, !active && shell.hidden)}
          initial={{ y: state.phase === "intro" ? "0%" : "125%" }}
          animate={controls}
        >
          <span {...stylex.props(shell.curveTop)} />
          <span {...stylex.props(shell.curveBottom)} />
          <span {...stylex.props(shell.word)}>
            {(state.phase !== "intro" || word !== null) && (
              <i {...stylex.props(shell.wordDot)} />
            )}
            {state.phase === "intro"
              ? word
              : "label" in state
                ? state.label
                : ""}
          </span>
        </motion.div>
        <noscript>
          <style>{"#redesign-curtain{display:none!important}"}</style>
        </noscript>
      </div>
    </NavigationContext>
  );
}
