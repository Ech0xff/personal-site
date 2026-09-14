"use client";
import { useAnimationControls } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { shouldPlayIntro, shuffleGreetings } from "./intro.helper";
import { navigation, introGreetings } from "./navigation.const";
import { useRouteReadiness } from "./route-readiness.hook";

type CurtainState = Readonly<{
  phase: "idle" | "intro" | "covering" | "waiting" | "revealing";
  href: string;
  round: number;
  animated: boolean;
}>;
const easing = [0.76, 0, 0.24, 1] as const;
const reducedMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;
const routeLabel = (href: string) =>
  navigation.find(
    (item) =>
      item.href === href ||
      (item.href !== "/" && href.startsWith(`${item.href}/`)),
  )?.label ?? "Design system";

export function useDeskNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const controls = useAnimationControls();
  const entryControls = useAnimationControls();
  const [state, setState] = useState<CurtainState>(() => ({
    phase: "intro",
    href: pathname,
    round: 0,
    animated: true,
  }));
  const [word, setWord] = useState<string | null>(null);
  const content = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const sequence = useRef(0);
  const previousPath = useRef(pathname);
  const busy = useRef(true);
  const { register, isReady } = useRouteReadiness();
  const ready = pathname === state.href && isReady(state.href, state.round);
  const active = state.phase !== "idle" || !ready;

  const finish = useCallback(
    (round: number) => {
      if (sequence.current !== round) return;
      controls.set({ y: "-125%" });
      entryControls.set({ y: 0, opacity: 1 });
      setState((previous) => ({ ...previous, phase: "idle" }));
      busy.current = false;
      if (content.current) content.current.inert = false;
      // Activity retains hidden routes; focus only a heading in the visible page.
      const visibleHeading = [
        ...(content.current?.querySelectorAll<HTMLElement>("#desk-main h1") ??
          []),
      ].find((node) => node.getClientRects().length > 0);
      (
        visibleHeading ??
        content.current?.querySelector<HTMLElement>("#desk-main")
      )?.focus({ preventScroll: true });
    },
    [controls, entryControls],
  );

  const begin = useCallback(
    (href: string, animated: boolean, push: boolean) => {
      const round = ++sequence.current;
      busy.current = true;
      controls.stop();
      entryControls.stop();
      entryControls.set({ y: 0, opacity: 1 });
      const covering = animated && push;
      controls.set({ y: covering ? "125%" : "0%" });
      setState({
        phase: covering ? "covering" : "waiting",
        href,
        round,
        animated,
      });
      if (!covering && push) router.push(href);
    },
    [controls, entryControls, router],
  );

  useEffect(() => {
    const historyReturn = performance
      .getEntriesByType("navigation")
      .some((entry) => "type" in entry && entry.type === "back_forward");
    if (
      !shouldPlayIntro(
        historyReturn ? "back_forward" : undefined,
        reducedMotion(),
      )
    ) {
      setState((previous) => ({
        ...previous,
        phase: "waiting",
        animated: false,
      }));
      return;
    }
    const greetings = shuffleGreetings(
      introGreetings,
      introGreetings.slice(1).map(() => Math.random()),
    );
    setWord(greetings[0] ?? null);
    const timers = greetings.map((greeting, index) =>
      setTimeout(
        () => setWord(greeting),
        index === 0 ? 0 : 350 + (index - 1) * 150,
      ),
    );
    timers.push(
      setTimeout(
        () =>
          setState((previous) =>
            previous.phase === "intro"
              ? { ...previous, phase: "waiting" }
              : previous,
          ),
        1400,
      ),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (state.phase !== "covering") return;
    const { round, href } = state;
    let completed = false;
    const covered = () => {
      if (completed || sequence.current !== round) return;
      completed = true;
      controls.set({ y: "0%" });
      setState((previous) =>
        previous.phase === "covering"
          ? { ...previous, phase: "waiting" }
          : previous,
      );
      router.push(href);
    };
    // An animation failure must not prevent navigation from starting.
    const watchdog = setTimeout(covered, 1500);
    void controls
      .start({ y: "0%", transition: { duration: 0.5, ease: easing } })
      .then(() => {
        clearTimeout(watchdog);
        covered();
      });
    return () => clearTimeout(watchdog);
  }, [controls, router, state]);

  useLayoutEffect(() => {
    // Back/forward, redirects and non-DeskLink navigations also need a data gate.
    const changed = previousPath.current !== pathname;
    previousPath.current = pathname;
    if (changed && pathname !== state.href) {
      begin(pathname, false, false);
    } else if (
      (state.phase === "idle" || state.phase === "revealing") &&
      !ready
    ) {
      begin(pathname, false, false);
    }
  }, [begin, pathname, ready, state.href, state.phase]);

  useEffect(() => {
    const pop = () => begin(window.location.pathname, false, false);
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [begin]);

  useLayoutEffect(() => {
    const node = content.current;
    if (node) node.inert = active;
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    curtain.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      if (node) node.inert = false;
    };
  }, [active]);

  useEffect(() => {
    if (state.phase !== "waiting" || !ready) return;
    if (!state.animated || reducedMotion()) {
      finish(state.round);
      return;
    }
    setState((previous) => ({ ...previous, phase: "revealing" }));
  }, [finish, ready, state]);

  useEffect(() => {
    if (state.phase !== "revealing") return;
    const { round } = state;
    entryControls.set({ y: 20, opacity: 0 });
    void entryControls.start({
      y: 0,
      opacity: 1,
      transition: { duration: 0.65, delay: 0.1 },
    });
    const watchdog = setTimeout(() => finish(round), 1500);
    void controls
      .start({ y: "-125%", transition: { duration: 0.65, ease: easing } })
      .then(() => {
        clearTimeout(watchdog);
        finish(round);
      });
    return () => clearTimeout(watchdog);
  }, [controls, entryControls, finish, state]);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      if (!preference.matches || state.phase === "idle") return;
      sequence.current++;
      controls.stop();
      entryControls.stop();
      controls.set({ y: "0%" });
      entryControls.set({ y: 0, opacity: 1 });
      setState((previous) => ({
        ...previous,
        phase: "waiting",
        round: sequence.current,
        animated: false,
      }));
      if (state.phase === "covering") router.push(state.href);
    };
    preference.addEventListener("change", change);
    return () => preference.removeEventListener("change", change);
  }, [controls, entryControls, router, state]);

  const navigate = (href: string) => {
    if (href === pathname || busy.current) return;
    begin(href, !reducedMotion(), true);
  };
  return {
    pathname,
    controls,
    entryControls,
    state,
    word,
    content,
    curtain,
    active,
    navigate,
    label: routeLabel(state.href),
    readiness: { round: state.round, register },
  };
}
