"use client";
import { toMerged } from "es-toolkit";
import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { match } from "ts-pattern";

import Stack from "#components/ui/stack.component";
import { isThemeTransitioning } from "#lib/client/theme-transition.service";

type TypewriterPhase = (typeof PHASE)[keyof typeof PHASE];

type TypewriterState = Readonly<{
  currentIndex: number;
  currentText: string;
  phase: TypewriterPhase;
}>;

const PHASE = {
  typing: "typing",
  holding: "holding",
  deleting: "deleting",
  waiting: "waiting",
} as const;

const INITIAL_STATE: TypewriterState = {
  currentIndex: 0,
  currentText: "",
  phase: "typing",
};

const PHASE_DELAY = {
  typing: 100,
  holding: 2500,
  deleting: 50,
  waiting: 500,
} as const satisfies Readonly<Record<TypewriterPhase, number>>;

export default function Typewriter({ texts }: { texts: string[] }) {
  const reducedMotion = useReducedMotion();
  const textCount = texts.length;
  const [state, setState] = useState<TypewriterState>(INITIAL_STATE);
  const fullText = texts[state.currentIndex] ?? "";

  useEffect(() => {
    if (reducedMotion || textCount === 0) return;

    const tick = () => {
      if (isThemeTransitioning()) {
        timer = setTimeout(tick, 50);
        return;
      }
      setState((state) => {
        const { phase, currentText } = state;
        return match(phase)
          .with(PHASE.typing, () =>
            toMerged(state, {
              currentText: fullText.slice(0, currentText.length + 1),
              phase: currentText === fullText ? PHASE.holding : PHASE.typing,
            }),
          )
          .with(PHASE.holding, () =>
            toMerged(state, {
              phase: PHASE.deleting,
            }),
          )
          .with(PHASE.deleting, () =>
            toMerged(state, {
              currentText: currentText.slice(0, -1),
              phase: !currentText.length ? PHASE.waiting : PHASE.deleting,
            }),
          )
          .with(PHASE.waiting, () => ({
            currentIndex: (state.currentIndex + 1) % textCount,
            currentText: "",
            phase: PHASE.typing,
          }))
          .exhaustive();
      });
    };
    let timer = setTimeout(tick, PHASE_DELAY[state.phase]);

    return () => window.clearTimeout(timer);
  }, [reducedMotion, state, textCount, fullText]);

  return (
    <Stack
      x
      className="items-center gap-2 font-mono tracking-widest text-text-muted"
    >
      <div className="flex items-center gap-1 text-[1.2em] font-black">
        {reducedMotion ? texts[0] : state.currentText}
        <span className="typing-cursor">▋</span>
      </div>
    </Stack>
  );
}
